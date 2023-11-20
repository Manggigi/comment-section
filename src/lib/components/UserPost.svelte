<script lang="ts">
	import { getTimeAgo } from '$lib/utils';
</script>

<div class="bg-white p-6 rounded-lg shadow-xl">
	<div class="flex items-center gap-2">
		<a href="https://giandenorte.com/" target="_blank">
			<img class="h-12 w-12 rounded-full" src={'/avatar.webp'} alt="avatar" />
		</a>
		<a href="https://giandenorte.com/" target="_blank">
			<div class="">Gian Denorte</div>
		</a>
		<div class="text-neutral-400 text-xs">{getTimeAgo('08-30-2000')}</div>
	</div>
	<div class="py-4 lg:pt-2 text-neutral-500">
		I'm Gian, a Manila-based software engineer specializing in front-end development. I excel in
		Svelte, React, and modern web tech, crafting engaging interfaces and seamless user experiences
		to bring designs to life and solve complex challenges.
	</div>
</div>
