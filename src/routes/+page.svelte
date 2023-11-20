<script lang="ts">
	import {
		addComment,
		deleteComment,
		downvoteComment,
		updateComment,
		upvoteComment
	} from '$lib/comments';
	import Reply from '$lib/components/Reply.svelte';
	import Modal from '$lib/components/modal.svelte';

	import { addReply } from '$lib/replies';
	import { commentsData, currentUser, modalContent, showModal } from '$lib/stores';
	import { receive, send } from '$lib/transitions';
	import { getTimeAgo, initializeComments, initializeCurrentUser } from '$lib/utils';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	onMount(() => {
		commentsData.set(initializeComments());
		currentUser.set(initializeCurrentUser());
	});

	let newComment = '';
	let updatedCommentValue = '';
	let newReply = '';

	let isReplying = false;
	let isEditing = false;
	let currentEditingId: number;

	// Function to open the modal
	function openModal() {
		modalContent.set('delete-comment');
		showModal.set(true);
	}

	function handleDeleteComment() {
		deleteComment(currentEditingId);
	}

	function startEditing(commentId: number, updatedContent: string) {
		currentEditingId = commentId;
		updatedCommentValue = updatedContent;
		isEditing = true;
	}

	function handleUpdateComment(commentId: number) {
		if (updatedCommentValue === '') return;
		updateComment(commentId, updatedCommentValue);
		isEditing = false;
	}

	function handleAddReply(commentId: number) {
		if (newReply === '') return;
		currentEditingId = commentId;
		isReplying = !isReplying;
		addReply(commentId, newReply, $currentUser, '');
		newReply = '';
	}
</script>

{#if $showModal && $modalContent == 'delete-comment'}
	<Modal
		title="Delete comment"
		description="Are you sure you want to delete this comment? This will remove the comment and can't be undone."
		deleteAction={handleDeleteComment}
	/>
{/if}

<div class="mb-12">
	<h2 class="font-semibold text-xl mt-8">Comments</h2>

	<ul>
		{#each $commentsData?.sort((a, b) => b.score - a.score) as comment (comment.id)}
			<li class="my-4" in:receive={{ key: comment.id }} out:send={{ key: comment.id }}>
				<!-- UI for comment -->
				<div class="bg-white p-4 rounded-lg shadow-xl divide-y">
					<div class="lg:flex text-neutral-500">
						<div class="lg:order-1 w-full">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<img class="h-12 w-12 rounded-full" src={comment.user.image.png} alt="avatar" />
									<div class="">{comment.user.username}</div>
									<div class="text-neutral-400 text-xs">{getTimeAgo(comment.createdAt)}</div>
								</div>
								<div class="hidden lg:block">
									<div class="flex justify-between">
										<!-- if current user, show reply else edit and delete -->
										<!-- edit and delete -->
										{#if $currentUser.username === comment.user.username}
											<div class="flex gap-2">
												<button
													on:click={() => startEditing(comment.id, comment.content)}
													class="w-full flex items-center pr-4"
												>
													<span class="pr-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="h-5 w-5 fill-[#73420D]"
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
														openModal();
														currentEditingId = comment.id;
													}}
													class="flex items-center text-red"
												>
													<span class="pr-2">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="h-5 w-5 fill-[red]"
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
											<button
												class="flex items-center"
												on:click={() => {
													isReplying = !isReplying;
													currentEditingId = comment.id;
												}}
											>
												<svg
													class="h-5 w-5 mr-2 fill-[#73420D]"
													viewBox="-0.5 0 28 28"
													version="1.1"
													xmlns="http://www.w3.org/2000/svg"
													xmlns:xlink="http://www.w3.org/1999/xlink"
												>
													<title>reply</title>
													<desc>Created with Sketch Beta.</desc>
													<defs />
													<g
														id="Page-1"
														stroke="none"
														stroke-width="1"
														fill="none"
														fill-rule="evenodd"
													>
														<g
															id="Icon-Set-Filled"
															transform="translate(-102.000000, -1195.000000)"
															fill="#73420D"
														>
															<path
																d="M113.983,1202.01 L113.983,1196.11 C114.017,1195.81 113.936,1195.51 113.708,1195.28 C113.312,1194.89 112.67,1194.89 112.274,1195.28 L102.285,1206.24 C102.074,1206.45 101.984,1206.72 101.998,1207 C101.984,1207.27 102.074,1207.55 102.285,1207.76 L112.219,1218.65 C112.59,1218.97 113.271,1219.15 113.708,1218.71 C113.935,1218.49 114.035,1218.29 114,1218 L114,1212 C120.6,1212 126.569,1216.75 127.754,1223.01 C128.552,1221.17 129,1219.15 129,1217.02 C129,1208.73 122.276,1202.01 113.983,1202.01"
																id="reply"
															/>
														</g>
													</g>
												</svg>
												{isReplying && currentEditingId === comment.id ? 'discard' : 'reply'}
											</button>
										{/if}
									</div>
								</div>
							</div>
							<div class="py-4">
								{#if isEditing && currentEditingId === comment.id}
									<div class="flex flex-col gap-4 items-end">
										<textarea
											on:keydown={(e) => {
												if (e.key === 'Enter') {
													if (updatedCommentValue === '') return;
													handleUpdateComment(comment.id);
												}
											}}
											bind:value={updatedCommentValue}
											rows="4"
											placeholder="Update reply..."
											class="p-4 relative block pt-4 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
										<button
											type="button"
											disabled={!updatedCommentValue}
											on:click={() => handleUpdateComment(comment.id)}
											class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										>
											Update
										</button>
									</div>
								{:else}
									<div>{comment.content}</div>
								{/if}
							</div>
						</div>
						<div class="flex justify-between items-center lg:items-start text-blue-600">
							<div class="flex lg:flex-col lg:pr-4 items-center gap-6 lg:gap-2">
								<button
									on:click={() =>
										upvoteComment(
											comment.id,
											$currentUser.upvotedComments,
											$currentUser.downvotedComments
										)}
									class="hover:text-blue-400 p-2 text-xl font-semibold lg:px-4 {$currentUser.upvotedComments?.includes(
										comment.id
									) && 'text-red-500'}">+</button
								>
								<div class="text-md">{comment.score}</div>
								<button
									on:click={() =>
										downvoteComment(
											comment.id,
											$currentUser.upvotedComments,
											$currentUser.downvotedComments
										)}
									class="hover:text-blue-400 p-2 text-xl font-semibold lg:px-4 {$currentUser.downvotedComments?.includes(
										comment.id
									) && 'text-red-500'}">-</button
								>
							</div>
							<!-- action buttons -->
							<div class="lg:hidden">
								<div class="flex justify-between">
									<!-- if current user, show reply else edit and delete -->
									<!-- edit and delete -->
									{#if $currentUser.username === comment.user.username}
										<div class="flex gap-2">
											<button
												on:click={() => startEditing(comment.id, comment.content)}
												class="w-full flex items-center pr-4"
											>
												<span class="pr-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
														class="h-5 w-5 fill-[#73420D]"
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
													openModal();
													currentEditingId = comment.id;
												}}
												class="flex items-center text-red"
											>
												<span class="pr-2">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
														class="h-5 w-5 fill-[red]"
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
													currentEditingId = comment.id;
												}}
											>
												<svg
													class="h-4 w-4 mr-2 fill-[#73420D]"
													viewBox="-0.5 0 28 28"
													version="1.1"
													xmlns="http://www.w3.org/2000/svg"
													xmlns:xlink="http://www.w3.org/1999/xlink"
												>
													<title>reply</title>
													<desc>Created with Sketch Beta.</desc>
													<defs />
													<g
														id="Page-1"
														stroke="none"
														stroke-width="1"
														fill="none"
														fill-rule="evenodd"
													>
														<g
															id="Icon-Set-Filled"
															transform="translate(-102.000000, -1195.000000)"
															fill="#73420D"
														>
															<path
																d="M113.983,1202.01 L113.983,1196.11 C114.017,1195.81 113.936,1195.51 113.708,1195.28 C113.312,1194.89 112.67,1194.89 112.274,1195.28 L102.285,1206.24 C102.074,1206.45 101.984,1206.72 101.998,1207 C101.984,1207.27 102.074,1207.55 102.285,1207.76 L112.219,1218.65 C112.59,1218.97 113.271,1219.15 113.708,1218.71 C113.935,1218.49 114.035,1218.29 114,1218 L114,1212 C120.6,1212 126.569,1216.75 127.754,1223.01 C128.552,1221.17 129,1219.15 129,1217.02 C129,1208.73 122.276,1202.01 113.983,1202.01"
																id="reply"
															/>
														</g>
													</g>
												</svg>
												{isReplying && currentEditingId === comment.id ? 'discard' : 'reply'}
											</button>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
					{#if isReplying && currentEditingId === comment.id}
						<div class="pt-4 flex items-start gap-4 bg-white rounded-lg text-blue-600">
							<img src={$currentUser.image.png} alt="avatar" class="h-12 w-12 rounded-full" />

							<div class="flex-grow relative">
								<textarea
									bind:value={newReply}
									on:keydown={(e) => {
										if (e.key === 'Enter') {
											handleAddReply(comment.id);
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
								on:click={() => handleAddReply(comment.id)}
								class="rounded-md disabled:bg-neutral-300 disabled:cursor-not-allowed bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Send
							</button>
						</div>
					{/if}
				</div>

				<!-- end UI for comment component -->

				<ul>
					{#each comment.replies?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) as reply (reply.id)}
						<li
							class="pl-8 my-4"
							in:receive={{ key: reply.id }}
							out:send={{ key: reply.id }}
							animate:flip={{ duration: 200 }}
						>
							{#if comment.replies.length > 0}
								<Reply {comment} {reply} />
							{/if}
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<!-- Add a comment box -->
	<div
		class="flex flex-wrap items-start gap-4 p-4 mt-8 bg-white rounded-lg text-blue-600 shadow-xl"
	>
		<img src={$currentUser.image.png} alt="avatar" class="h-12 w-12 rounded-full" />

		<div class="flex-grow relative order-first lg:order-none">
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
