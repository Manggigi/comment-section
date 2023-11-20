import { commentsData, currentUser } from '$lib/stores';
import type { Reply, User } from '$lib/types';
import { setLocalStorage } from './utils';

export function addReply(commentId: number, newContent: string, user: User, replyingTo: string) {
	if (newContent === '') return;

	currentUser.update((user) => {
		user.upvotedReplies?.push(commentId);
		return user;
	});

	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		const newReply: Reply = {
			id: Date.now(),
			content: newContent,
			createdAt: new Date().toISOString(),
			score: 1,
			replyingTo: replyingTo || comment?.user?.username || '',
			user
		};
		if (comment) {
			comment.replies.push(newReply);
		}
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

export function updateReply(commentId: number, replyId: number, newContent: string) {
	if (newContent === '') return;
	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		if (comment) {
			const reply = comment.replies.find((reply) => reply.id === replyId);
			if (reply) {
				reply.content = newContent;
			}
		}
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

export function deleteReply(commentId: number, replyId: number) {
	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		if (comment) {
			comment.replies = comment.replies.filter((reply) => reply.id !== replyId);
		}
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

const updateScore = (delta: number, commentId: number, replyId: number) => {
	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		if (comment) {
			const reply = comment.replies.find((reply) => reply.id === replyId);
			if (reply) reply.score += delta;
		}
		setLocalStorage('commentsData', comments);
		return comments;
	});
};

const updateUserVotes = (
	votes: 'upvotedReplies' | 'downvotedReplies',
	remove: boolean,
	replyId: number
) => {
	currentUser.update((user) => {
		if (user[votes]) {
			if (remove) {
				user[votes] = user[votes]?.filter((id) => id !== replyId);
			} else {
				user[votes]?.push(replyId);
			}
		}
		setLocalStorage('currentUser', user);
		return user;
	});
};

export function upvoteReply(
	commentId: number,
	replyId: number,
	upvotedReplies: number[] = [],
	downvotedReplies: number[] = []
) {
	if (downvotedReplies.includes(replyId)) {
		updateUserVotes('downvotedReplies', true, replyId);
		updateScore(1, commentId, replyId);
	} else if (!upvotedReplies.includes(replyId)) {
		updateUserVotes('upvotedReplies', false, replyId);
		updateScore(1, commentId, replyId);
	} else if (upvotedReplies.includes(replyId)) {
		updateUserVotes('upvotedReplies', true, replyId);
		updateScore(-1, commentId, replyId);
	}
}

export function downvoteReply(
	commentId: number,
	replyId: number,
	upvotedReplies: number[] = [],
	downvotedReplies: number[] = []
) {
	if (upvotedReplies.includes(replyId)) {
		updateUserVotes('upvotedReplies', true, replyId);
		updateScore(-1, commentId, replyId);
	} else if (!downvotedReplies.includes(replyId)) {
		updateUserVotes('downvotedReplies', false, replyId);
		updateScore(-1, commentId, replyId);
	} else if (downvotedReplies.includes(replyId)) {
		updateUserVotes('downvotedReplies', true, replyId);
		updateScore(1, commentId, replyId);
	}
}
