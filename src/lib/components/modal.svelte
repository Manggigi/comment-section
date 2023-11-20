<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { showModal } from '$lib/stores';

	export let title = 'This is the modal title';
	export let description = 'This is the modal description';
	export let deleteAction: () => void;

	// Function to close the modal
	function closeModal() {
		showModal.set(false);
	}

	function handleDelete() {
		deleteAction();
		closeModal();
	}
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
	<div
		class="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 200 }}
	></div>

	<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
		<div
			class="flex min-h-full justify-center items-center"
			in:scale={{ duration: 300, start: 0.95 }}
			out:scale={{ duration: 200 }}
		>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-sm sm:max-w-lg p-4"
			>
				<div class="flex items-start">
					<div class="ml-4 mt-0 text-left">
						<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
							{title}
						</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								{description}
							</p>
						</div>
					</div>
				</div>
				<div class="mt-4 flex flex-row-reverse">
					<button
						on:click={handleDelete}
						type="button"
						class="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 ml-3 w-auto"
						>YES, DELETE</button
					>
					<button
						on:click={closeModal}
						type="button"
						class="inline-flex justify-center rounded-md bg-neutral-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-0 w-auto"
						>NO, CANCEL</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
