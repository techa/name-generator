<script lang="ts">
	import { onMount } from 'svelte';
	import AddSource from '../components/AddSource.svelte';

	import { NameGenerator, type NameResult } from '$lib/NameGenerator.js';
	import '../global/string/capitalize.js';
	import { all, types, langs, lango } from '../constants/sources.js';

	let mount = false;

	let setting: boolean[][] = [
		Array(langs.length).fill(false), // family
		Array(langs.length).fill(false), // female
		Array(langs.length).fill(false), // male
		[], // userResource
	];
	setting[0][0] = true;

	let userResource: Record<string, string[]> = {};
	let userKeys = Object.keys(userResource);
	let result: NameResult[] = [];
	let filter = true;
	const ng = new NameGenerator();

	let splitter = 1;

	$: if (mount) {
		ng.splitter = splitter;
		filter;
		reload();
	}

	onMount(async () => {
		const val = localStorage.getItem('UserResource');
		if (val) {
			userResource = JSON.parse(val);
		} else {
			const mt = await (await fetch('./data/other-mt.txt')).text();
			const jw = await (await fetch('./data/other-jw.txt')).text();
			userResource = {
				Mt: mt.split('\n'),
				Jewel: jw.split('\n'),
			};
			console.log('Mt and Jewel data loaded.');
		}
		userKeys = Object.keys(userResource);

		const _setting = JSON.parse(localStorage.getItem('setting'));
		if (_setting) {
			setting = _setting;
		}
		change();

		mount = true;
	});

	function save(e) {
		const { title } = e.detail;
		const deleteIndex = userKeys.indexOf(title);
		if (deleteIndex > -1) {
			// delete
			userKeys.splice(deleteIndex, 1);
			setting[types.length].splice(deleteIndex, 1);
		}
		const keys = Object.keys(userResource);
		const add = keys.findIndex((v) => !userKeys.includes(v));
		userKeys = keys;
		if (add > -1) {
			setting[types.length].splice(add, 0, true);
		}

		localStorage.setItem('UserResource', JSON.stringify(userResource));
		localStorage.setItem('setting', JSON.stringify(setting));
	}

	function checkAll(checked: boolean, index: number) {
		setting[index] = Array(setting[index].length).fill(checked);
	}
	function reload() {
		result = [];
		// 重複回避用。For avoid redundancy
		const names: Set<string> = new Set();

		for (let i = 0; i < 30; i++) {
			try {
				// 重複回避。Avoid redundancy
				let name = ng.create();
				let j = 100;
				while (names.has(name.kana) || (!filter && name.exist)) {
					name = ng.create();
					if (!--j) {
						console.log('name', name);
						break;
					}
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
					const data =
						i === 3
							? userResource[userKeys[j]]
							: all[types[i]][langs[j]];
					if (data) {
						ng.add(data, i >= 3);
						doReload = true;
					} else {
						console.error(userKeys[j]);
					}
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
	<section class="left">
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
			<div class="tool flex">
				<div class="btn-set">
					{#each ['Syllable', '2-Gram', '3-Gram'] as label, i}
						<button
							on:click={() => (splitter = i + 1)}
							class:active={splitter === i + 1}>{label}</button
						>
					{/each}
				</div>
			</div>

			{#each types as type, i}
				<label class="check_all">
					<input
						type="checkbox"
						on:change={(e) => {
							checkAll(e.currentTarget.checked, i);
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

			{#if userKeys.length}
				{@const typel = types.length}
				<label class="check_all">
					<input
						type="checkbox"
						on:change={(e) => {
							checkAll(e.currentTarget.checked, typel);
						}}
					/>
					User
				</label>
				<div class="langs flex">
					{#each userKeys as title, i}
						<label class="lang">
							<input
								type="checkbox"
								bind:checked={setting[typel][i]}
							/>
							{title}
						</label>
					{/each}
				</div>
			{/if}
		</form>

		<AddSource {userResource} on:save={save} />
	</section>
	<section class="right w-1/2">
		<div class="tool flex">
			<button class="reload" on:click={reload}>Reload</button>
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
	</section>
</main>

<style>
	form {
		user-select: none;
		/* position: sticky; */
	}
	.left {
		margin-right: 2rem;
		flex: 0 0 65%;
	}
	.right {
		min-width: 12rem;
		flex: 1;
	}
	.tool {
		margin: 0.5rem 0;
	}
	button.active {
		background-color: var(--primary-color);
		border-color: var(--primary-color);
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
	.reload {
		background-color: var(--attention-color);
		border-color: var(--attention-color);
		border-radius: 4px;
		color: #fff;
		font-weight: bold;
	}
	span,
	.name.exist {
		color: var(--primary-color);
	}
	.name:hover {
		background: var(--base-light);
	}
</style>
