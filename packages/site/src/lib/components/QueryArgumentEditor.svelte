<script lang='ts'>
    import {
        ArgumentNode,
        FieldNode,
        GraphQLEnumType,
        GraphQLField,
        GraphQLInputObjectType,
        GraphQLInputType,
        GraphQLList,
        GraphQLNonNull,
        GraphQLScalarType,
        Kind,
        ObjectFieldNode,
        ObjectValueNode,
        ValueNode
    } from "graphql";

    const createArgumentNodeFromSchema = (name: string, graphQLArgument: GraphQLInputType | GraphQLField<any, any, any>): ArgumentNode => ({
		kind: Kind.ARGUMENT,
		name: {
			kind: Kind.NAME,
			value: name
		},
		value: createArgumentValueNodeFromSchema(graphQLArgument)
	})

	const createFieldNodeFromSchema = (name: string, graphQLArgument: GraphQLInputType | GraphQLField<any, any, any>): ObjectFieldNode => ({
		kind: Kind.OBJECT_FIELD,
		name: {
			kind: Kind.NAME,
			value: name
		},
		value: createArgumentValueNodeFromSchema(graphQLArgument)
	})

	const createArgumentValueNodeFromSchema = (graphQLArgument: GraphQLInputType | GraphQLField<any, any, any>): ValueNode => {
		const ofType = graphQLArgument instanceof GraphQLNonNull ? graphQLArgument.ofType : graphQLArgument

		if (ofType instanceof GraphQLList) {
			return {
				kind: Kind.LIST,
				values: [],
			}			
		}

		if (ofType instanceof GraphQLScalarType) {
			if (ofType.name === 'Int') {
				return {
					kind: Kind.INT,
					value: '0'
				}
			}

			return {
				kind: Kind.STRING,
				value: ''
			}
		}

		if (ofType instanceof GraphQLEnumType) {
			return {
				kind: Kind.ENUM,
				value: ofType.getValues()[0].name
			}
		}

		if (ofType instanceof GraphQLInputObjectType) {
			return {
				kind: Kind.OBJECT,
				fields: [],
			}			
		}
	}

	type AstParent = FieldNode | ObjectValueNode


    export let astParent: AstParent;




	$: astIndex = (astParent.kind === Kind.FIELD)
		? astParent.arguments.findIndex(argument => argument.name.value === fieldName)
		: astParent.fields.findIndex(field => field.name.value === fieldName)

	$: astPropName = (astParent.kind === Kind.FIELD)
		? 'arguments'
		: 'fields'

	$: ast = astParent[astPropName][astIndex]

	let handleAddArgument = (parent: AstParent, name: string, graphQLArgument: GraphQLInputType | GraphQLField<any, any, any>) => {
		if (parent.kind === Kind.FIELD) {
			astParent = {
				...parent,
				arguments: parent.arguments.concat(createArgumentNodeFromSchema(name, graphQLArgument))
			}
		} else if (parent.kind === Kind.OBJECT) {
			astParent = {
				...parent,
				fields: parent.fields.concat(createFieldNodeFromSchema(name, graphQLArgument))
			}
		}
	}

	let handleRemoveSelf = () => {
		if (astParent.kind === Kind.FIELD) {
			astParent = {
				...astParent,
				arguments: astParent.arguments.filter(arg => arg.name.value !== fieldName)
			}
		} else if (astParent.kind === Kind.OBJECT) {
			astParent = {
				...astParent,
				fields: astParent.fields.filter(field => field.name.value !== fieldName)
			}
		}
	}

    export let schema: GraphQLInputType | GraphQLField<any, any, any>;
	export let fieldName: string;
</script>

{#if !ast}
	<li
		class="unselected-option action-add"
		style="flex-basis: 100%; display: block;"
		on:click|preventDefault|stopPropagation={e => {
			handleAddArgument(astParent, fieldName, schema)
		}}
	>
			&nbsp;&nbsp;&nbsp;&nbsp;{fieldName}: {schema.toString()}
	</li>
{:else}
	{#if schema instanceof GraphQLNonNull}
		<svelte:self bind:astParent={astParent} schema={schema.ofType} fieldName={fieldName}/>
	{:else if schema instanceof GraphQLScalarType}
		<!-- Not 100% where to validate this, but ast.value is constrained by what is in the schema .. -->
		{#if 'value' in ast.value && typeof ast.value.value === 'string'}
			<li on:click|preventDefault|stopPropagation>
				<span
					class="selected-option action-remove"
					on:click|preventDefault|stopPropagation={handleRemoveSelf}
				>
						&nbsp;&nbsp;&nbsp;&nbsp;{fieldName}:
				</span>
				<input
					bind:value={ast.value.value}
					style="width: {Math.max(5, ast.value.value.length) + 2}ch;"
					on:click|stopPropagation|preventDefault
				/>
			</li>
		{/if}
	{:else if schema instanceof GraphQLInputObjectType}
		<li
			on:click|preventDefault|stopPropagation
		>
			<span
				class="selected-option action-remove"
				on:click|preventDefault|stopPropagation={handleRemoveSelf}
			>
				&nbsp;&nbsp;&nbsp;&nbsp;{fieldName}: {'{'}
			</span>
			<ul>
				{#each Object.values(schema.getFields()) as field}
					<svelte:self 
						bind:astParent={astParent[astPropName][astIndex].value}
						schema={field.type}
						fieldName={field.name}
					/>
				{/each}
			</ul>
		</li>
		<span class="selected-option" style='display: block;'>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</span>
	{:else if schema instanceof GraphQLEnumType}
		<li on:click|preventDefault|stopPropagation>
			<span
				class="selected-option action-remove"
				on:click|preventDefault|stopPropagation={handleRemoveSelf}	
			>
				&nbsp;&nbsp;&nbsp;&nbsp;{fieldName}:
			</span>
			<select
				bind:value={ast.value.value}
				style="width: {Math.max(5, ast.value.value.length) + 3}ch;"
				on:click|preventDefault|stopPropagation
			>
				{#each schema.getValues() as optionValue}
					<option value={optionValue.value}>{optionValue.name}</option>
				{/each}
			</select>
		</li>
	{:else}

		Cannot edit unsupported type
	{/if}
{/if}

