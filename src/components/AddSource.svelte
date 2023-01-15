<script lang="ts">
	import {
		// onMount,
		// beforeUpdate,
		// afterUpdate,
		createEventDispatcher,
	} from 'svelte';
	import Dropdown from './Dropdown.svelte';

	const dispatch = createEventDispatcher();

	let title = 'Title';
	let text = '';

	export let userResource: Record<string, string[]> = {};

	function save() {
		if (title) {
			const data = text.split(/[^ァ-ー・＝]+/).filter((v) => v);
			if (data.length) {
				userResource[title] = data;
			} else {
				delete userResource[title];
			}
			dispatch('save', { title, data, text });
		}
	}
</script>

<div class="add_source flex">
	<Dropdown class="user-list" let:close>
		<div slot="trigger" class="btn-set flex">
			<input placeholder="DataTitle" required bind:value={title} />
			<button>↓</button>
		</div>
		{#each Object.keys(userResource) as key (key)}
			<button
				class="name"
				on:click={() => {
					title = key;
					text = userResource[title].join('\n');
					close();
				}}>{key}</button
			>
		{/each}
	</Dropdown>

	<button on:click={save}
		>{text ? (userResource[title] ? 'Save' : '+ Add') : '- Remove'}</button
	>
	<button on:click={() => (text = '')}>Clear</button>
</div>

<textarea bind:value={text} placeholder="カタカナを抽出してリスト化する" />

<style>
	.add_source {
		gap: 0.5rem;
		margin: 0.5rem 0;
	}
	.name {
		display: block;
		padding: 0 0.5rem;
		outline: none;
		background-color: transparent;
		color: currentColor;
		border: none;
		text-align: left;
		width: 100%;

		box-sizing: border-box;
	}
	.name:hover {
		font-weight: bold;
		background-color: var(--base-color);
	}
	.btn-set :first-child {
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;

		border-top-right-radius: 0;
		border-bottom-right-radius: 0;

		box-sizing: border-box;
	}
	.btn-set :last-child {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;

		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;

		box-sizing: border-box;
	}
	:global(.user-list) {
		position: absolute;
		width: 100%;
		top: 100%;
		left: 0;
		z-index: 10;
		border: #555 1px solid;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		background-color: #111;
		box-sizing: border-box;
		font-family: 'Courier New', Courier, monospace;
	}
	textarea {
		width: 100%;
		height: fit-content;
		resize: vertical;
		background: rgb(34, 34, 34);
		color: #fff;
		border-radius: 2px;
		padding: 0.5rem;
		box-sizing: border-box;
		border-color: #555;
	}
	input {
		font-family: 'Courier New', Courier, monospace;
	}
	input:invalid {
		border-color: red;
	}
</style>
