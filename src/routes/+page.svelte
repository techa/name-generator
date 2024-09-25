<script lang="ts">
	import { onMount } from 'svelte';
	import AddSource from '../components/AddSource.svelte';
	import { base } from '$app/paths';

	import { NameGenerator, type NameResult } from '$lib/NameGenerator.js';
	import '../global/string/capitalize.js';
	import { all, types, langs, lango } from '../constants/sources.js';

	const STRG_KEY = 'name-generator@0.0.1/';
	const USER = `${STRG_KEY}UserResource`;
	const SETTINGS = `${STRG_KEY}Settings`;

	let mount = false;

	let checks: boolean[][] = [
		Array(langs.length).fill(false), // family
		Array(langs.length).fill(false), // female
		Array(langs.length).fill(false), // male
		[], // userResource
	];
	checks[0][0] = true;

	let userResource: Record<string, string[]> = {};
	let userKeys = Object.keys(userResource);
	let result: NameResult[] = [];
	let existFilter = true;
	let howmany = 30;
	const ng = new NameGenerator();

	let splitter = 1;

	$: if (mount) {
		ng.splitter = splitter;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		existFilter;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		howmany;
		reload();
	}

	onMount(async () => {
		const val = localStorage.getItem(USER);
		if (val) {
			userResource = JSON.parse(val);
		} else {
			try {
				// https://kit.svelte.dev/docs/modules#$app-paths
				const mt = await (
					await fetch(`${base}/data/other-mt.txt`)
				).text();
				const jw = await (
					await fetch(`${base}/data/other-jw.txt`)
				).text();
				userResource = {
					Mt: mt.split('\n'),
					Jewel: jw.split('\n'),
				};
				checks[types.length] = [false, false];
				console.log('Mt and Jewel data loaded.');
			} catch (error) {
				console.error(`Bad fetch response. ${error}`);
			}
		}
		userKeys = Object.keys(userResource);

		const _setting = JSON.parse(localStorage.getItem(SETTINGS));
		if (_setting) {
			checks = _setting.checks;
			howmany = _setting.howmany;
			existFilter = _setting.existFilter;
		}

		// Delete old data
		if (!val && !_setting) {
			localStorage.clear();
		}

		change({}, false);

		mount = true;
	});

	function saveSettings() {
		localStorage.setItem(
			SETTINGS,
			JSON.stringify({
				checks,
				howmany,
				existFilter,
			}),
		);
	}

	function save(e) {
		const { title } = e.detail;
		const deleteIndex = userKeys.indexOf(title);
		if (deleteIndex > -1) {
			// delete
			userKeys.splice(deleteIndex, 1);
			checks[types.length].splice(deleteIndex, 1);
		}
		const keys = Object.keys(userResource);
		const add = keys.findIndex((v) => !userKeys.includes(v));
		userKeys = keys;
		if (add > -1) {
			checks[types.length].splice(add, 0, true);
		}

		localStorage.setItem(USER, JSON.stringify(userResource));

		if (deleteIndex + add !== -2) {
			saveSettings();
		}
	}

	function checkAll(checked: boolean, index: number) {
		checks[index] = Array(checks[index].length).fill(checked);
	}
	function reload() {
		result = [];
		// 重複回避用。For avoid redundancy
		const names: Set<string> = new Set();

		for (let i = 0; i < howmany; i++) {
			try {
				// 重複回避。Avoid redundancy
				let name = ng.create();
				let j = 100;
				while (names.has(name.kana) || (!existFilter && name.exist)) {
					name = ng.create();
					if (!--j) {
						console.log('name', name);
						break;
					}
				}
				names.add(name.kana);
				result.push(name);
			} catch {
				break;
			}
		}
	}
	function change(e, save = true) {
		if (save) {
			saveSettings();
		}

		ng.clear();
		let doReload = false;

		for (let i = 0; i < checks.length; i++) {
			for (let j = 0; j < checks[i].length; j++) {
				const bool = checks[i][j];
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
			カタカナのリストを分解して再構成することで、それっぽい名前を生成する。<span
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
						checked={checks[i].every((v) => v)}
						on:change={(e) => {
							checkAll(e.currentTarget.checked, i);
						}}
					/>
					{type.capitalize()}
				</label>
				<div class="langs flex">
					{#each checks[i] as bool, j}
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
						checked={checks[typel].every((v) => v)}
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
								bind:checked={checks[typel][i]}
							/>
							{title}
						</label>
					{/each}
				</div>
			{/if}
		</form>

		<AddSource {userResource} on:save={save} />

		<h2>Source Credits</h2>
		<ul>
			<li>
				<a
					href="https://www.worldsys.org/europe"
					rel="noopener noreferrer"
				>
					欧羅巴人名録
				</a>
			</li>
			<li>
				<a
					href="https://alarabiyah.sakura.ne.jp/category/words/name/"
					rel="noopener noreferrer"
				>
					アラブ人名・家名辞典
				</a>
			</li>
		</ul>
		、
	</section>
	<section class="right w-1/2">
		<form class="tool flex" on:change={saveSettings}>
			<button class="reload" on:click={reload}>Reload</button>
			<!-- <button on:click={() => (result = [])}>Clear</button> -->
			<label>
				<input type="checkbox" bind:checked={existFilter} />
				<span>Exist</span>
			</label>

			<input type="number" min="1" max="30" bind:value={howmany} />

			<div class="flex-auto" />
			<button on:click={() => copy()}>Copy All</button>
		</form>

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
	.tool > label {
		padding: 0.2rem;
	}
	.tool > input[type='number'] {
		width: 3rem;
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
