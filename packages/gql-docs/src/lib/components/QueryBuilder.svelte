<script lang="ts">
	import {
		ArgumentNode,
		buildClientSchema,
		FieldNode,
		GraphQLType,
		isInputObjectType,
		isObjectType,
		isScalarType,
		Kind,
		isInterfaceType,
		OperationDefinitionNode,
		OperationTypeNode,
		SelectionSetNode,
		SelectionNode,
		GraphQLField,
		GraphQLUnionType
	} from 'graphql';

	import type { IntrospectionQuery } from 'graphql';
	export let introspectionQuery: any;
	export let fieldName: string;
	export let schemaField: GraphQLField<any, any, any>;
	export let removeSelf;

	const createSelectionNode = (name: string): FieldNode => ({
		kind: Kind.FIELD,
		name: {
			kind: Kind.NAME,
			value: name
		}
	});

	type InteractiveArgumentNode = ArgumentNode & {
		interactive: {
			editing: boolean;
		};
	};

	const createArgumentNode = (name: string): InteractiveArgumentNode => ({
		kind: Kind.ARGUMENT,
		name: {
			kind: Kind.NAME,
			value: name
		},
		value: {
			kind: Kind.STRING,
			value: ''
		},
		interactive: {
			editing: true
		}
	});

	const resolvesTo = (type: GraphQLType): string =>
		'ofType' in type ? resolvesTo(type.ofType) : type.name;
	const resolvesToScalarType = (type: GraphQLType): boolean =>
		'ofType' in type ? resolvesToScalarType(type.ofType) : isScalarType(type);
	export let typeName: string = undefined;

	type AstRoot = FieldNode | OperationDefinitionNode;

	export let onUpdateAst

	export let ast: AstRoot = {
		kind: Kind.OPERATION_DEFINITION,
		operation: OperationTypeNode.QUERY,
		selectionSet: {
			kind: Kind.SELECTION_SET,
			selections: []
		}
	};

	if (onUpdateAst) {
		onUpdateAst(ast)
	}


	export let updateAst = (update: (node: AstRoot) => AstRoot) => {
		ast = update(ast);
		if (onUpdateAst) {
			onUpdateAst(ast)			
		}
	};

	const schema = buildClientSchema(introspectionQuery as never as IntrospectionQuery);
	const pageType = schema.getType(typeName);
	const gqlFieldMap = (isObjectType(pageType) || isInterfaceType(pageType) || isInputObjectType(pageType)) && pageType.getFields();
	const fields = Object.keys(gqlFieldMap).map((k) => gqlFieldMap[k]);

	$: astSelections = ast.selectionSet && ast.selectionSet.selections || [];
	$: items = [...astSelections, ...fields];

	let argumentEditIndex;
	export let isDocumentFocus = true;

	export let setDocumentFocus = (v: boolean) => {
		isDocumentFocus = v;
	}

	$: handleUpdateSelectionSet = (update: ((sS: SelectionSetNode) => SelectionSetNode)) => {
		updateAst(ast => ({
			...ast,
			selectionSet: update(ast.selectionSet || {
				kind: Kind.SELECTION_SET,
				selections: []
			})
		}))
	}

	$: maybeInteractiveAdd = isDocumentFocus ? 'action-add' : '';
	$: maybeInteractiveRemove = isDocumentFocus ? 'action-remove' : '';

	$: generateChildProps = (selectionNode: SelectionNode) => {
		if (selectionNode.kind !== Kind.FIELD) {
			throw new Error(`selection node of type ${selectionNode} not supported`)
		};
		const fieldNode = selectionNode;

		const childTypeName = resolvesTo(gqlFieldMap[fieldNode.name.value].type);

		return {
			typeName: childTypeName,
			schemaField: gqlFieldMap[fieldNode.name.value],
			fieldName: gqlFieldMap[fieldNode.name.value].name,
			ast: fieldNode,
			introspectionQuery,
			isDocumentFocus,
			setDocumentFocus,
			removeSelf: () => handleUpdateSelectionSet(selectionSet => ({
				...selectionSet,
				selections: selectionSet.selections.filter(s => s !== selectionNode)
			})),
			updateAst: (update) => {
				console.log('child calling into parent')
				updateAst((ast) => ({
					...ast,
					selectionSet: {
						...ast.selectionSet,
						selections: ast.selectionSet.selections.map<SelectionNode>((selection) =>
							selection === fieldNode ? update(selection) : selection
						)
					}
				}))
			}
		};
	};
</script>

<svelte:head>
	<title>Query builder</title>
</svelte:head>


<li on:click={removeSelf} class='field'>
	{#if pageType instanceof GraphQLUnionType}
		<span class='{maybeInteractiveRemove}' style="color: #bbbbbb">{fieldName} - Querying on Union types is not yet supported, please create a feature request</span>
	{:else}
	<span class='selected-option {maybeInteractiveRemove}'>{fieldName}</span>
	{/if}
	{#if 'arguments' in ast}
		&nbsp;<span style="flex-grow: 1;" class='selected-option {maybeInteractiveRemove}'>(</span>
		{#if 'arguments' in ast && ast.arguments.length > 0}
			{#each ast.arguments as astArgument, astArgumentIndex}
				<div
					style="flex-basis: 100%;"
					class="{maybeInteractiveAdd} selected-option"
					on:click={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					&nbsp; &nbsp; {astArgument.name.value}: 
					{#if astArgumentIndex === argumentEditIndex}
						{#if astArgument.value.kind === Kind.VARIABLE}
							VARIABLE NOT SUPPORTED
						{:else if astArgument.value.kind === Kind.NULL}
							NULL NOT SUPPORTED
						{:else if astArgument.value.kind === Kind.LIST}
							LIST NOT SUPPORTED
						{:else if astArgument.value.kind === Kind.OBJECT}
							OBJECT NOT SUPPORTED
						{:else}
							<input
								autofocus
								bind:value={astArgument.value.value}
								on:keydown={(e) => {
									if (e.code === 'Enter') {
										setDocumentFocus(true);
										argumentEditIndex = undefined;
									}
								}}
							/>
						{/if}
					
					{:else}
						<span
							on:click={e => {
								e.preventDefault();
								e.stopPropagation();

								argumentEditIndex = astArgumentIndex;
								setDocumentFocus(false);
							}}
						>
							{#if astArgument.value.kind === Kind.VARIABLE}
								VARIABLE NOT SUPPORTED
							{:else if astArgument.value.kind === Kind.NULL}
								NULL NOT SUPPORTED
							{:else if astArgument.value.kind === Kind.LIST}
								LIST NOT SUPPORTED
							{:else if astArgument.value.kind === Kind.OBJECT}
								OBJECT NOT SUPPORTED
							{:else}
								{astArgument.value.value}
							{/if}
						</span>
					{/if}
				</div>
			{/each}
		{/if}
		{#each schemaField.args as schemaArg}
			{#if ast.arguments.every((astArg) => astArg.name.value !== schemaArg.name)}
				<div
					style="flex-basis: 100%;"
					class="{maybeInteractiveAdd} unselected-option"
					on:click={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDocumentFocus(false);
						argumentEditIndex = 'arguments' in ast ? ast.arguments.length : 0
						updateAst(ast => ({
							...ast,
							arguments: (('arguments' in ast) ? ast.arguments : []).concat(createArgumentNode(schemaArg.name))
						}))
					}}
				>
					&nbsp; &nbsp; {schemaArg.name}: {resolvesTo(schemaArg.type)}
				</div>
			{/if}
		{/each}
		)
	{:else if schemaField && 'args' in schemaField && schemaField.args.length > 0}
		<span
			class="selected-option {maybeInteractiveAdd}"
			on:click={(e) => {
				e.preventDefault();
				e.stopPropagation();

				updateAst(ast => ({
					...ast,
					arguments: []
				}))
			}}
		>
			(...)
		</span>
	{/if}
	{#if fields.length > 0}
		<span class='selected-option {maybeInteractiveRemove}' style='flex-grow: 1;'>&nbsp{'{'}</span>
	{/if}
</li>
{#if items.length !== 0}
	<ul style="margin-top: 0;">
		{#if astSelections.length !== 0}
			{#each astSelections as selection}
				<svelte:self
					{...generateChildProps(selection)}
				/>
			{/each}
		{/if}
		{#if fields.length !== 0}
			{#each fields as field}
				<li
					class='unselected-option {maybeInteractiveAdd}'
					on:click={(e) => {
						e.stopPropagation();
						e.preventDefault();
						handleUpdateSelectionSet(selectionSet => ({
							...selectionSet,
							selections: selectionSet.selections.concat(createSelectionNode(field.name))
						}))
					}}
				>{field.name}: {field.type}</li>
			{/each}
		{/if}
	</ul>
{/if}
{#if fields.length > 0}
	<span class='selected-option {maybeInteractiveRemove}' style='display: block;'>{'}'}</span>
{/if}

<style>

	.field {
		display: flex;
		flex-wrap: wrap;
	}
	li {
		list-style-type: none;
	}

	.selected-option {
		color: var(--lime-2);
		font-weight: bold;
	}

	.unselected-option {
		color: var(--lime-4);
	}

	.action-add {
		cursor: pointer;
	}
	.action-add:hover {
		background-color: var(--lime-8);
	}

	.action-remove {
		cursor: pointer;
	}
	.action-remove:hover {
		background-color: var(--action-remove);
	}

	.interactive {
		cursor: pointer;
	}

	.interactive:hover {
		background-color: var(--lime-8);
	}

	input {
		font-family: 'Noto Sans Mono', monospace;
		outline: none;
		background-color: var(--lime-8);
		border: none;
		font-size: 14px;
		color: var(--lime-2);
	}
</style>
