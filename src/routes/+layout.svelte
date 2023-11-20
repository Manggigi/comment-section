<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';

	export let data: LayoutData;
</script>

<div class="bg-indigo-50">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<main class="mx-auto max-w-3xl">
			<slot />
		</main>
	</div>
</div>
