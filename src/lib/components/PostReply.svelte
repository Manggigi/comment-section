<script lang="ts">
	import { addReply } from '$lib/replies';
	import { currentUser } from '$lib/stores';
	import type { Comment } from '$lib/types';

	export let comment: Comment;

	let newReply = '';

	const handleAddReply = () => {
		if (newReply === '') return;
		addReply(comment.id, newReply, $currentUser, '');
		newReply = '';
	};
</script>

<div class="pt-4 flex items-start gap-4 bg-white rounded-lg text-blue-600">
	<img src={$currentUser.image.png} alt="avatar" class="h-12 w-12 rounded-full" />

	<div class="flex-grow relative">
		<textarea
			bind:value={newReply}
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					handleAddReply();
				}
			}}
			rows="2"
			placeholder="Add a reply..."
			class="p-4 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
		/>
	</div>
	<button
		type="button"
		disabled={!newReply}
		on:click={handleAddReply}
		class="rounded-md disabled:bg-neutral-300 disabled:cursor-not-allowed bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	>
		Send
	</button>
</div>
