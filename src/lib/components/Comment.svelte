<script lang="ts">
	import { downvoteComment, updateComment, upvoteComment } from '$lib/comments';
	import PostReply from '$lib/components/PostReply.svelte';
	import Reply from '$lib/components/Reply.svelte';
	import { currentUser, modalContent, showModal } from '$lib/stores';
	import { receive, send } from '$lib/transitions';
	import type { Comment } from '$lib/types';
	import { getTimeAgo } from '$lib/utils';
	import { flip } from 'svelte/animate';

	export let comment: Comment;
	export let currentEditingId: number;
	export let currentReplyingId: number;

	let updatedCommentValue = '';
	let isReplying = false;
	let isEditing = false;

	function openModal() {
		modalContent.set('delete-comment');
		showModal.set(true);
	}

	function startEditing(commentId: number, updatedContent: string) {
		currentEditingId = commentId;
		updatedCommentValue = updatedContent;
		isEditing = true;
	}

	function handleUpdateComment(commentId: number) {
		if (updatedCommentValue === '') return;
		updateComment(commentId, updatedCommentValue.trim());
		isEditing = false;
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

<li class="my-4" in:receive={{ key: comment.id }} out:send={{ key: comment.id }}>
	<!-- UI for comment -->
	<div class="bg-white p-4 rounded-lg shadow-xl divide-y">
		<div class="lg:flex text-neutral-500">
			<div class="lg:order-1 w-full">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<a href="/{comment.user.username}">
							<img class="h-12 w-12 rounded-full" src={comment.user.image.png} alt="avatar" />
						</a>
						<a href="/{comment.user.username}">
							<div class="">
								{comment.user.username}
								{#if $currentUser.username === comment.user.username}
									<span class="bg-indigo-700 text-white p-1 text-xs font-semibold rounded-md"
										>YOU</span
									>
								{/if}
							</div>
						</a>
						<div class="text-neutral-400 text-xs">{getTimeAgo(comment.createdAt)}</div>
					</div>
					<div class="hidden lg:block">
						<div class="flex justify-between">
							<!-- if current user, show reply else edit and delete -->
							<!-- edit and delete -->
							{#if $currentUser.username === comment.user.username}
								<div class="flex gap-4">
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
												class="h-4 w-4 fill-[red]"
											>
												<path d="M3 6h18" />
												<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
												<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
											</svg>
										</span>
										delete
									</button>
									<button
										on:click={() => startEditing(comment.id, comment.content)}
										class="w-full flex items-center text-blue-600"
									>
										<span class="pr-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												class="h-4 w-4 fill-[#2563eb]"
											>
												<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
													d="m15 5 4 4"
												/>
											</svg>
										</span>
										update
									</button>
								</div>
							{:else}
								<button
									class="flex items-center text-blue-600"
									on:click={() => {
										isReplying = !isReplying;
										currentEditingId = comment.id;
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
												fill="#2563eb"
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
									if (e.key === 'Enter' && updatedCommentValue.trim()) {
										e.preventDefault();
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
								disabled={!updatedCommentValue.trim()}
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
				<div class="flex pr-2 lg:flex-col lg: items-center gap-6 lg:gap-2">
					<button
						on:mousedown={handleMouseDownUp}
						on:mouseup={handleMouseUpUp}
						on:touchstart={handleMouseDownUp}
						on:touchend={handleMouseUpUp}
						on:click={() =>
							upvoteComment(
								comment.id,
								$currentUser.upvotedComments,
								$currentUser.downvotedComments
							)}
						style="transform: scale({scaleUp}); transition: transform 0.1s ease-in-out;"
						class="hover:text-red-400 active:text-red-500 p-2 text-xl font-semibold lg:px-4 {$currentUser.upvotedComments?.includes(
							comment.id
						) && 'text-red-500'}">+</button
					>
					<div
						style="transform: scale({scaleUp}); transition: transform 0.1s ease-in-out;"
						class="text-md"
					>
						{comment.score}
					</div>
					<button
						on:mousedown={handleMouseDownDown}
						on:mouseup={handleMouseUpDown}
						on:touchstart={handleMouseDownDown}
						on:touchend={handleMouseUpDown}
						on:click={() =>
							downvoteComment(
								comment.id,
								$currentUser.upvotedComments,
								$currentUser.downvotedComments
							)}
						style="transform: scale({scaleDown}); transition: transform 0.1s ease-in-out;"
						class="hover:text-red-400 active:text-red-500 p-2 text-xl font-semibold lg:px-4 {$currentUser.downvotedComments?.includes(
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
							<div class="flex gap-4">
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
											class="h-4 w-4 fill-[red]"
										>
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										</svg>
									</span>
									delete
								</button>
								<button
									on:click={() => startEditing(comment.id, comment.content)}
									class="w-full flex items-center"
								>
									<span class="pr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="h-4 w-4 fill-[#2563eb]"
										>
											<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path
												d="m15 5 4 4"
											/>
										</svg>
									</span>
									update
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
												fill="#2563eb"
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
			<PostReply {comment} />
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
					<Reply {comment} {reply} bind:currentReplyingId bind:currentEditingId />
				{/if}
			</li>
		{/each}
	</ul>
</li>
