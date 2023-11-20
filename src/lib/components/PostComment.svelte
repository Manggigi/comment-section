<script lang="ts">
	import { addComment } from '$lib/comments';
	import { currentUser } from '$lib/stores';

	let newComment = '';
</script>

<div class="p-4 mt-8 pb-8 bg-white rounded-lg text-blue-600 shadow-2xl">
	<div class="relative mt-4 lg:hidden">
		<label
			for="comment"
			class="block absolute -translate-y-4 bg-white px-2 top-1 left-2 z-10 text-xs font-medium leading-6 text-gray-400"
		>
			Add a comment
		</label>
		<textarea
			bind:value={newComment}
			rows="4"
			name="comment"
			id="comment"
			placeholder="Add a comment..."
			class="p-4 relative block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
		/>
	</div>
	<div class="mt-4 pt-8 flex items-center lg:items-start justify-between">
		<img src={$currentUser.image.png} alt="avatar" class="h-12 w-12 rounded-full" />
		<div class="relative flex-grow px-4 hidden lg:block">
			<label
				for="comment"
				class="block absolute -translate-y-4 bg-white px-2 top-1 left-2 z-10 text-xs font-medium leading-6 text-gray-400"
			>
				Add a comment
			</label>
			<textarea
				bind:value={newComment}
				rows="4"
				name="comment"
				id="comment"
				placeholder="Add a comment..."
				class="p-4 relative block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>
		<button
			type="button"
			disabled={!newComment}
			on:click={() => {
				addComment(newComment, $currentUser);
				newComment = '';
			}}
			class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Send
		</button>
	</div>
</div>
