<script lang="ts">
	export let json;
	export let pageTitle = undefined;
	export let handlePageSave = undefined;

	export let parent = true;
	export let pageState = {
		previewMode: true
	};

	const initPageSettings = (json) => {
		if (['string', 'number', 'boolean'].includes(typeof json)) {
			return {
				value: json,
				textStyle: 'none',
				isEditActive: false
			};
		}

		if (Array.isArray(json)) {
			return {
				// childSettings: json.map((elem) => initPageSettings(elem))
				// assume array is homogeneous
				// need to keep edit state inside the child though ...
				childSettings: initPageSettings(json[0])
			};
		}

		const childSettings = Object.fromEntries(
			Object.entries(json).map(([k, v]) => {
				return [k, initPageSettings(v)];
			})
		);

		return {
			childSettings,
			isEditActive: false,
			shouldShowLabel: true,
			labels: Object.fromEntries(Object.keys(json).map((k) => [k, k]))
		};
	};

	export let pageSettings = initPageSettings(json);

	function handleEditClick() {
		pageSettings.isEditActive = !pageSettings.isEditActive;
	}

	const textStyles = ['none', 'title'];

	function handleTextStyleClick() {
		pageSettings.textStyle =
			textStyles[(textStyles.indexOf(pageSettings.textStyle) + 1) % textStyles.length];
	}

	function handleShowLabelClick() {
		pageSettings.shouldShowLabel = !pageSettings.shouldShowLabel;
	}


	// OKAY WE ARE GETTING VERY CLOSE!!
	// the hard part here is not actually knowing what the schema of the blob is
	// what we want to do next, is apply a change to ALL array children
	// RN we are not using our gql query / schema to drive the page maker
	// Although an array in our json blob may have consistent (or not!) schema for its elements, we cannot infer this from the json
	// For now, we will ignore this and hack something together
</script>


{#if parent}
	<h1>{pageTitle}</h1>

	<span
		class={pageSettings.pageState
			? 'selected-option action-remove'
			: 'unselected-option action-add'}
		on:click|preventDefault={() => {
			pageState.previewMode = !pageState.previewMode;
		}}>{pageState.previewMode ? 'EDIT PAGE' : 'PREVIEW PAGE'}</span
	>
	<br />
	<span
		class='unselected-option action-add'
		on:click={() => {
			handlePageSave(pageSettings)
		}}>SAVE PAGE
	</span>
{/if}

{#if typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean'}
	{#if !pageState.previewMode}
		<span
			class={pageSettings.isEditActive
				? 'selected-option action-remove'
				: 'unselected-option action-add'}
			on:click|stopPropagation={handleEditClick}>EDIT</span
		>
		{#if pageSettings.isEditActive}
			<ul>
				<li
					on:click|stopPropagation={handleTextStyleClick}
					class={pageSettings.shouldShowLabel
						? 'selected-option action-remove'
						: 'unselected-option action-add'}
				>
					text style: {pageSettings.textStyle}
				</li>
			</ul>
		{/if}
	{/if}

	{#if pageSettings.textStyle === 'none'}
		<p>{json}</p>
	{:else if pageSettings.textStyle === 'title'}
		<h2>
			{json}
		</h2>
	{/if}
{:else if Array.isArray(json)}
	<ul>
		{#each json as elem, i}
			<li>
				<svelte:self
					parent={false}
					json={elem}
					bind:pageSettings={pageSettings.childSettings}
					bind:pageState
				/>
			</li>
			<br />
		{/each}
	</ul>
{:else}
	<table>
		<thead>
			<tr>
				{#if !pageState.previewMode}
					<span
						class={pageSettings.isEditActive
							? 'selected-option action-remove'
							: 'unselected-option action-add'}
						on:click|stopPropagation={handleEditClick}>EDIT</span
					>
					{#if pageSettings.isEditActive}
						<ul>
							<li
								on:click|stopPropagation={handleShowLabelClick}
								class={pageSettings.shouldShowLabel
									? 'selected-option action-remove'
									: 'unselected-option action-add'}
							>
								show label
							</li>
						</ul>
					{/if}
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(json) as [k, v]}
				{#if !pageSettings.shouldShowLabel}
					<svelte:self
						parent={false}
						json={v}
						bind:pageSettings={pageSettings.childSettings[k]}
						bind:pageState
					/>
				{:else}
					<tr>
						<td>
							{#if pageState.previewMode}
								<span>{pageSettings.labels[k]}</span>
							{:else}
								<input bind:value={pageSettings.labels[k]} />
							{/if}
						</td>
						<td>
							<svelte:self
								parent={false}
								json={v}
								bind:pageSettings={pageSettings.childSettings[k]}
								bind:pageState
							/>
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
{/if}

<style>
	td {
		text-align: left;
		vertical-align: top;
		border: 1px solid #666666;
		padding: 7px;
		background-color: black;
	}
</style>
