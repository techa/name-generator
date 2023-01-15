<script lang="ts">
	/**
	 * https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/dropdowns/Dropdown.svelte
	 * https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/utils/Popper.svelte
	 */

	let contentEl: HTMLDivElement;

	export let label = '';
	export let open = false;

	// managment of the race condition between focusin and click events
	let _blocked = false;
	const block = () => (
		(_blocked = true), setTimeout(() => (_blocked = false), 500)
	);
	const showHandler = (ev: Event) => {
		if (ev.type === 'focusin' && !open) block();
		open = ev.type === 'click' && !_blocked ? !open : true;
	};

	const hideHandler = () => {
		setTimeout(
			() => contentEl.contains(document.activeElement) || (open = false),
			100,
		);
	};
</script>

<div class="dropdown-wapper">
	<div
		class="label-wapper"
		on:focusin={showHandler}
		on:focusout={hideHandler}
	>
		<slot name="trigger">
			<button>{label}</button>
		</slot>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class={'dropdown ' + ($$props.class || '')}
		class:hidden={!open}
		style={$$props.style}
		role="tooltip"
		bind:this={contentEl}
		on:focusin={showHandler}
		on:focusout={hideHandler}
	>
		<slot close={() => (open = false)} />
	</div>
</div>

<style>
	.dropdown-wapper {
		position: relative;
	}
	.label-wapper {
		display: flex;
	}
	.dropdown {
		display: block;
		position: absolute;
		top: 100%;
		max-height: 50vh;
		overflow-x: hidden;
		overflow-y: auto;

		transition-duration: 0.3s;
		transition-property: opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

		z-index: 100;
	}
	.hidden {
		opacity: 0;
		display: none;
	}
</style>
