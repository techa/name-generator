<script lang="ts">
	import { onMount } from 'svelte';
	import { NameGenerator, type NameResult } from '$lib/NameGenerator.js';
	import '../global/string/capitalize.js';
	import { all, types, langs, lango } from '../constants/sources.js';

	let setting: boolean[][] = [
		Array(langs.length).fill(false), // family
		Array(langs.length).fill(false), // female
		Array(langs.length).fill(false), // male
		[], // userResource
	];
	setting[0][0] = true;

	let result: NameResult[] = [];
	let filter = true;
	const ng = new NameGenerator();

	$: {
		filter;
		reload();
	}

	onMount(() => {
		const _setting = JSON.parse(localStorage.getItem('setting'));
		if (_setting) {
			setting = _setting;
		}
		change();
	});

	function checkAll(e, index: number) {
		setting[index] = Array(langs.length).fill(e.target.checked);
	}
	function reload() {
		result = [];
		// 重複回避用。For avoid redundancy
		const names: Set<string> = new Set();

		for (let i = 0; i < 30; i++) {
			try {
				// 重複回避。Avoid redundancy
				let name = ng.create();
				while (names.has(name.kana) || (!filter && name.exist)) {
					name = ng.create();
				}
				names.add(name.kana);
				result.push(name);
			} catch (error) {
				break;
			}
		}
	}
	function change() {
		localStorage?.setItem('setting', JSON.stringify(setting));

		ng.clear();
		let doReload = false;

		for (let i = 0; i < setting.length; i++) {
			for (let j = 0; j < setting[i].length; j++) {
				const bool = setting[i][j];
				if (bool) {
					ng.add(all[types[i]][langs[j]]);
					doReload = true;
				}
			}
		}

		if (doReload) {
			reload();
		} else {
			result = [];
		}
	}
	function copy(str = '') {
		str ||= result.reduce((s, v) => s + v.kana + '\n', '');
		navigator.clipboard.writeText(str);
	}
</script>

<svelte:head>
	<title>Name Generator</title>
</svelte:head>

<main class="flex">
	<div class="left">
		<div class="about">
			<a href="https://www.worldsys.org/europe" rel="noopener noreferrer"
				>欧羅巴人名録</a
			>様、<a
				href="https://alarabiyah.sakura.ne.jp/category/words/name/"
				rel="noopener noreferrer">アラブ人名・家名辞典</a
			>様のデータを分解して再構成することで、それっぽい名前を生成する。<span
				>青字</span
			>は元データにも存在する名前。
		</div>
		<h2>Source controller</h2>
		<form class="w-1/2 select-none" on:change={change}>
			{#each types as type, i}
				<label class="typ">
					<input
						type="checkbox"
						on:change={(e) => {
							checkAll(e, i);
						}}
					/>
					{type.capitalize()}
				</label>
				<div class="langs flex">
					{#each setting[i] as bool, j}
						<label class="lang" title="{lango[j]}語">
							<input type="checkbox" bind:checked={bool} />
							{langs[j].toUpperCase()}
						</label>
					{/each}
				</div>
				<hr />
			{/each}
		</form>
	</div>
	<div class="right w-1/2">
		<div class="tool flex">
			<button on:click={reload}>Reload</button>
			<!-- <button on:click={() => (result = [])}>Clear</button> -->
			<label>
				<input type="checkbox" bind:checked={filter} />
				<span>Exist</span>
			</label>

			<div class="flex-auto" />
			<button on:click={() => copy()}>Copy All</button>
		</div>

		{#each result as name}
			<button
				class="name"
				class:exist={name.exist}
				on:click={() => {
					copy(name.kana);
				}}
			>
				{name.kana}
			</button>
		{/each}
	</div>
</main>

<style>
	form {
		user-select: none;
		/* position: sticky; */
	}
	.left {
		margin-right: 2rem;
		flex: 0 0 50%;
	}
	.right {
		min-width: 12rem;
		flex: 1;
	}
	.tool {
		margin: 0.5rem 0;
	}
	.name {
		font-weight: bold;
		display: block;
		outline: none;
		background-color: transparent;
		color: currentColor;
		border: none;
		text-align: left;
		width: 100%;
	}
	span,
	.name.exist {
		color: var(--primary-color);
	}
	.name:hover {
		background: rgb(86, 86, 86);
	}
</style>
