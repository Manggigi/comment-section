<script lang="ts">
	import { addReply, downvoteReply, updateReply, upvoteReply } from '$lib/replies';
	import { currentUser, modalContent, showModal } from '$lib/stores';
	import type { Comment, Reply } from '$lib/types';
	import { getTimeAgo } from '$lib/utils';

	export let comment: Comment;
	export let reply: Reply;
	export let currentReplyingId: number;
	export let currentEditingId: number;

	let isReplying = false;
	let newReply = '';
	let isEditing = false;
	let currentEditingReplyId: number;

	function startEditing(replyId: number) {
		currentEditingReplyId = replyId;
		isEditing = true;
	}

	// Function to open the modal
	function openModal() {
		modalContent.set('delete-reply');
		showModal.set(true);
	}

	function handleUpdateReply(commentId: number, replyId: number, updatedContent: string) {
		if (updatedContent === '') return;
		updateReply(commentId, replyId, updatedContent);
		isEditing = false;
	}

	function handleAddReply(commentId: number, replyingTo: string) {
		if (newReply === '') return;
		currentEditingReplyId = commentId;
		isReplying = !isReplying;
		addReply(commentId, newReply, $currentUser, replyingTo);
		newReply = '';
	}

	let scaleUp = 1;
	let scaleDown = 1;

	function handleMouseDownUp() {
		scaleUp = 1.5;
	}

	function handleMouseUpUp() {
		scaleUp = 1;
	}

	function handleMouseDownDown() {
		scaleDown = 1.5;
	}

	function handleMouseUpDown() {
		scaleDown = 1;
	}
</script>

<div class="bg-white p-4 rounded-lg shadow-xl">
	<div class="lg:flex text-neutral-500">
		<div class="lg:order-1 w-full">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<a href="/{reply.user.username}">
						<img class="h-12 w-12 rounded-full" src={reply.user.image.png} alt="avatar" />
					</a>
					<a href="/{reply.user.username}">
						<div class="">{reply.user.username}</div>
					</a>
					<div class="text-neutral-400 text-xs">{getTimeAgo(reply.createdAt)}</div>
				</div>
				<div class="hidden lg:block">
					<div class="flex justify-between">
						<!-- if current user, show reply else edit and delete -->
						<!-- edit and delete -->
						{#if $currentUser.username === reply.user.username}
							<div class="flex gap-2">
								<button
									on:click={() => startEditing(reply.id)}
									class="flex items-center pr-4 text-blue-600"
								>
									<span class="pr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="h-4 w-4 fill-[#256e3b]"
										>
											<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
												d="m15 5 4 4"
											/>
										</svg>
									</span>
									update
								</button>
								<button
									on:click={() => {
										currentEditingId = comment.id;
										currentReplyingId = reply.id;
										openModal();
									}}
									class="flex items-center text-red-500"
								>
									<span class="pr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="h-4 w-4 fill-[red]"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										</svg>
									</span>
									delete
								</button>
							</div>
						{:else}
							<div class="">
								<button
									class="flex items-center text-blue-600"
									on:click={() => {
										isReplying = !isReplying;
										currentEditingReplyId = reply.id;
									}}
								>
									<svg
										class="h-4 w-4 mr-2 fill-[#256e3b]"
										viewBox="-0.5 0 28 28"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<title>reply</title>
										<desc>Created with Sketch Beta.</desc>
										<defs />
										<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
											<g
												id="Icon-Set-Filled"
												transform="translate(-102.000000, -1195.000000)"
												fill="#256e3b"
											>
												<path
													d="M113.983,1202.01 L113.983,1196.11 C114.017,1195.81 113.936,1195.51 113.708,1195.28 C113.312,1194.89 112.67,1194.89 112.274,1195.28 L102.285,1206.24 C102.074,1206.45 101.984,1206.72 101.998,1207 C101.984,1207.27 102.074,1207.55 102.285,1207.76 L112.219,1218.65 C112.59,1218.97 113.271,1219.15 113.708,1218.71 C113.935,1218.49 114.035,1218.29 114,1218 L114,1212 C120.6,1212 126.569,1216.75 127.754,1223.01 C128.552,1221.17 129,1219.15 129,1217.02 C129,1208.73 122.276,1202.01 113.983,1202.01"
													id="reply"
												/>
											</g>
										</g>
									</svg>
									{isReplying && currentEditingReplyId === reply.id ? 'discard' : 'reply'}
								</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="py-4 lg:pt-2">
				{#if isEditing && currentEditingReplyId === reply.id}
					<div class="flex flex-col gap-4 items-end">
						<textarea
							bind:value={reply.content}
							on:keydown={(e) => {
								if (e.key === 'Enter' && reply.content.trim()) {
									handleUpdateReply(comment.id, reply.id, reply.content);
								}
							}}
							rows="4"
							name="comment"
							id="comment"
							placeholder="Add a comment..."
							class="p-4 relative block pt-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>

						<button
							type="button"
							disabled={!reply.content.trim()}
							on:click={() => handleUpdateReply(comment.id, reply.id, reply.content.trim())}
							class="rounded-md disabled:bg-neutral-300 disabled:cursor-not-allowed bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Update
						</button>
					</div>
				{:else}
					<div>
						<a href="/{reply.replyingTo}" class="text-blue-400">@{reply.replyingTo}</a>
						{reply.content}
					</div>
				{/if}
			</div>
		</div>
		<div class="flex justify-between items-center lg:items-start text-blue-600">
			<div class="flex lg:flex-col lg:pr-4 items-center gap-6 lg:gap-2">
				<button
					on:mousedown={handleMouseDownUp}
					on:mouseup={handleMouseUpUp}
					on:touchstart={handleMouseDownUp}
					on:touchend={handleMouseUpUp}
					on:click={() =>
						upvoteReply(
							comment.id,
							reply.id,
							$currentUser.upvotedReplies,
							$currentUser.downvotedReplies
						)}
					style="transform: scale({scaleUp}); transition: transform 0.1s ease-in-out;"
					class="hover:text-red-400 active:text-red-500 p-2 text-xl font-semibold lg:px-4 {$currentUser.upvotedReplies?.includes(
						reply.id
					) && 'text-red-500'}">+</button
				>
				<div class="text-md">{reply.score}</div>
				<button
					on:mousedown={handleMouseDownDown}
					on:mouseup={handleMouseUpDown}
					on:touchstart={handleMouseDownDown}
					on:touchend={handleMouseUpDown}
					on:click={() =>
						downvoteReply(
							comment.id,
							reply.id,
							$currentUser.upvotedReplies,
							$currentUser.downvotedReplies
						)}
					style="transform: scale({scaleDown}); transition: transform 0.1s ease-in-out;"
					class="hover:text-red-400 active:text-red-500 p-2 text-xl font-semibold lg:px-4 {$currentUser.downvotedReplies?.includes(
						reply.id
					) && 'text-red-500'}">-</button
				>
			</div>
			<!-- action buttons -->
			<div class="lg:hidden">
				<div class="flex justify-between">
					<!-- if current user, show reply else edit and delete -->
					<!-- edit and delete -->
					{#if $currentUser.username === reply.user.username}
						<div class="flex gap-2">
							<button on:click={() => startEditing(reply.id)} class="flex items-center pr-4">
								<span class="pr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="h-4 w-4 fill-[#256e3b]"
									>
										<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
											d="m15 5 4 4"
										/>
									</svg>
								</span>
								update
							</button>
							<button
								on:click={() => {
									currentEditingId = comment.id;
									currentReplyingId = reply.id;
									openModal();
								}}
								class="flex items-center text-red-500"
							>
								<span class="pr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="h-4 w-4 fill-[red]"
									>
										<path d="M3 6h18" />
										<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
										<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
									</svg>
								</span>
								delete
							</button>
						</div>
					{:else}
						<div class="">
							<button
								class="flex items-center"
								on:click={() => {
									isReplying = !isReplying;
									currentEditingReplyId = reply.id;
								}}
							>
								<svg
									class="h-4 w-4 mr-2 fill-[#2563eb]"
									viewBox="-0.5 0 28 28"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
								>
									<title>reply</title>
									<desc>Created with Sketch Beta.</desc>
									<defs />
									<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
										<g
											id="Icon-Set-Filled"
											transform="translate(-102.000000, -1195.000000)"
											fill="#256e3b"
										>
											<path
												d="M113.983,1202.01 L113.983,1196.11 C114.017,1195.81 113.936,1195.51 113.708,1195.28 C113.312,1194.89 112.67,1194.89 112.274,1195.28 L102.285,1206.24 C102.074,1206.45 101.984,1206.72 101.998,1207 C101.984,1207.27 102.074,1207.55 102.285,1207.76 L112.219,1218.65 C112.59,1218.97 113.271,1219.15 113.708,1218.71 C113.935,1218.49 114.035,1218.29 114,1218 L114,1212 C120.6,1212 126.569,1216.75 127.754,1223.01 C128.552,1221.17 129,1219.15 129,1217.02 C129,1208.73 122.276,1202.01 113.983,1202.01"
												id="reply"
											/>
										</g>
									</g>
								</svg>
								{isReplying && currentEditingReplyId === reply.id ? 'discard' : 'reply'}
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	{#if isReplying && currentEditingReplyId === reply.id}
		<div class="mt-4 flex items-start gap-4 bg-white rounded-lg text-blue-600">
			<img src={$currentUser.image.png} alt="avatar" class="h-12 w-12 rounded-full" />

			<div class="flex-grow relative">
				<textarea
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							handleAddReply(comment.id, reply.user.username);
						}
					}}
					bind:value={newReply}
					rows="2"
					placeholder="Add a reply..."
					class="p-4 relative block pt-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				/>
			</div>
			<button
				type="button"
				disabled={!newReply.trim}
				on:click={() => handleAddReply(comment.id, reply.user.username)}
				class="rounded-md disabled:bg-neutral-300 disabled:cursor-not-allowed bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Send
			</button>
		</div>
	{/if}
</div>
