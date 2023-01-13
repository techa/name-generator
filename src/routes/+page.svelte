<script lang="ts">
	import { NameGenerator, type NameResult } from '$lib/NameGenerator.js';
	import '../global/string/capitalize.js';
	import { all, types, langs } from '../constants/sources.js';

	const LANGS = [
		'英',
		'ドイツ',
		'フランス',
		'イタリア',
		'スペイン',
		'スウェーデン',
		'フィンランド',
		'ロシア',
		'チェコ',
		'オランダ',
	];

	const setting: boolean[][] = [
		[
			false, // en
			false, // de
			false, // fr
			false, // es
			false, // it
			false, // fi
			false, // sv
			false, // ru
			false, // cs
			false, // nl
		],
		[
			true, // en
			false, // de
			false, // fr
			false, // es
			false, // it
			false, // fi
			false, // sv
			false, // ru
			false, // cs
			false, // nl
		],
		[
			false, // en
			false, // de
			false, // fr
			false, // es
			false, // it
			false, // fi
			false, // sv
			false, // ru
			false, // cs
			false, // nl
		],
	];

	let result: NameResult[] = [];
	let filter = true;
	const ng = new NameGenerator();
	change();

	$: {
		filter;
		reload();
	}

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
				result.push(name);
			} catch (error) {
				break;
			}
		}
	}
	function change() {
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

<header class="flex">
	<h1 class="flex-auto">Name Generator</h1>
	<div class="head-right">
		<a
			href="https://github.com/techa/name-generator"
			rel="noopener noreferrer"
		>
			<svg
				class="s-icon"
				role="img"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><title>GitHub Repo</title><path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
		</a>
	</div>
</header>

<main class="flex">
	<div class="left">
		<div class="about">
			<a href="https://www.worldsys.org/europe" rel="noopener noreferrer"
				>欧羅巴人名録</a
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
						<label class="lang" title="{LANGS[j]}語">
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
	.head-right {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 2rem;
	}
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
	.s-icon {
		width: 18px;
		fill: var(--text-color);
	}
</style>
