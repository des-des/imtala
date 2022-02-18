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
		SelectionSetNode,
		SelectionNode,
		GraphQLField,
		GraphQLUnionType,
		GraphQLArgument,
		GraphQLScalarType,
		GraphQLEnumType,
		GraphQLInputObjectType,
		GraphQLList,
		GraphQLNonNull,
		ValueNode
	} from 'graphql';

	import type { IntrospectionQuery } from 'graphql';
	export let introspectionQuery: any;
	export let fieldName: string;
	export let schemaField: GraphQLField<any, any, any>;
	export let removeSelf;

	import QueryArgumentEditor from './QueryArgumentEditor.svelte';

	const createSelectionNode = (name: string): FieldNode => ({
		kind: Kind.FIELD,
		name: {
			kind: Kind.NAME,
			value: name
		}
	});


	const resolvesTo = (type: GraphQLType): string =>
		'ofType' in type ? resolvesTo(type.ofType) : type.name;
	const resolvesToScalarType = (type: GraphQLType): boolean =>
		'ofType' in type ? resolvesToScalarType(type.ofType) : isScalarType(type);
	export let typeName: string = undefined;

	type AstRoot = FieldNode | OperationDefinitionNode;

	export let ast: AstRoot;


	let updateAst = (update: (node: AstRoot) => AstRoot) => {
		ast = update(ast);
	};

	const schema = buildClientSchema(introspectionQuery as never as IntrospectionQuery);
	const pageType = schema.getType(typeName);
	const gqlFieldMap = (isObjectType(pageType) || isInterfaceType(pageType) || isInputObjectType(pageType)) && pageType.getFields();
	const fields = Object.keys(gqlFieldMap).map((k) => gqlFieldMap[k]);
	$: argMap = schemaField && schemaField.args.reduce<{[k: string]: GraphQLArgument}>((acc, arg) => {
		acc[arg.name] = arg
		return acc
	}, {})
	$: astSelections = ast.selectionSet && ast.selectionSet.selections || [];
	$: items = [...astSelections, ...fields];

	export let isDocumentFocus = true;

	export let setDocumentFocus = (v: boolean) => {
		isDocumentFocus = true;
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
			introspectionQuery,
			isDocumentFocus,
			setDocumentFocus,
			removeSelf: () => handleUpdateSelectionSet(selectionSet => ({
				...selectionSet,
				selections: selectionSet.selections.filter(s => s !== selectionNode)
			})),
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
		(<ul>
			{#each schemaField.args as schemaArg}
				<QueryArgumentEditor
					fieldName={schemaArg.name}
					schema={schemaArg.type}
					bind:astParent={ast}
				/>
			{/each}
		</ul> <span class='selected-option action-remove'>)</span>
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
			{#each astSelections as selection, selectionIndex}
				<svelte:self
					{...generateChildProps(selection)}
					bind:ast={astSelections[selectionIndex]}
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