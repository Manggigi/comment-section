<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 200 }}
	class="flex flex-col items-center justify-center h-screen p-6"
>
	<div class="rounded-full overflow-hidden">
		<img
			src="/avatars/{data.username}.png"
			height="128"
			width="128"
			alt="Profile picture"
			style="aspect-ratio: 128 / 128; object-fit: cover;"
		/>
	</div>
	<h2 class="text-2xl font-bold mt-4">{data.username}</h2>
	<a
		href="https://giandenorte.com/"
		target="_blank"
		type="button"
		class="rounded-md mt-4 disabled:bg-neutral-300 disabled:cursor-not-allowed bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>
		Message
	</a>
</div>
