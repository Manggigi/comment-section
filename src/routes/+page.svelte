<script lang="ts">
	import { deleteComment } from '$lib/comments';
	import Modal from '$lib/components/Modal.svelte';
	import PostComment from '$lib/components/PostComment.svelte';
	import Comment from '$lib/components/Comment.svelte';
	import { deleteReply } from '$lib/replies';
	import { commentsData, currentUser, modalContent, showModal } from '$lib/stores';
	import { initializeComments, initializeCurrentUser } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		commentsData.set(initializeComments());
		currentUser.set(initializeCurrentUser());
	});

	let currentEditingId: number;
	let currentReplyingId: number;

	function handleDeleteComment() {
		deleteComment(currentEditingId);
	}

	function handleDeleteReply() {
		deleteReply(currentEditingId, currentReplyingId);
	}
</script>

{#if $showModal && $modalContent == 'delete-comment'}
	<Modal
		title="Delete comment"
		description="Are you sure you want to delete this comment? This will remove the comment and can't be undone."
		deleteAction={handleDeleteComment}
	/>
{/if}

{#if $showModal && $modalContent === 'delete-reply'}
	<Modal
		title="Delete reply"
		description="Are you sure you want to delete this reply? This will remove the reply and can't be undone."
		deleteAction={handleDeleteReply}
	/>
{/if}

<div class="pb-12">
	<h2 class="font-semibold text-xl text-neutral-700 pt-8">Comments</h2>

	<ul>
		{#each $commentsData?.sort((a, b) => b.score - a.score) as comment (comment.id)}
			<Comment {comment} bind:currentEditingId bind:currentReplyingId />
		{/each}
	</ul>

	<PostComment />
</div>
