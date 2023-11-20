import { commentsData, currentUser } from '$lib/stores';
import type { Comment, User } from '$lib/types';
import { setLocalStorage } from './utils';

export function addComment(newContent: string, user: User) {
	if (newContent === '') return;
	const comment: Comment = {
		id: Date.now(),
		content: newContent,
		createdAt: new Date().toISOString(),
		score: 1,
		replies: [],
		user
	};
	currentUser.update((user) => {
		user.upvotedComments?.push(comment.id);
		return user;
	});
	commentsData.update((comments) => {
		comments.push(comment);
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

export function updateComment(commentId: number, newContent: string) {
	if (newContent === '') return;
	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		if (comment) {
			comment.content = newContent;
		}
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

export function deleteComment(commentId: number) {
	commentsData.update((comments) => {
		comments = comments.filter((comment) => comment.id !== commentId);
		setLocalStorage('commentsData', comments);
		return comments;
	});
}

const updateScore = (delta: number, commentId: number) => {
	commentsData.update((comments) => {
		const comment = comments.find((comment) => comment.id === commentId);
		if (comment) comment.score += delta;
		setLocalStorage('commentsData', comments);
		return comments;
	});
};

const updateUserVotes = (
	votes: 'upvotedComments' | 'downvotedComments',
	remove: boolean,
	commentId: number
) => {
	currentUser.update((user) => {
		if (user[votes]) {
			if (remove) {
				user[votes] = user[votes]?.filter((id) => id !== commentId);
			} else {
				user[votes]?.push(commentId);
			}
		}
		setLocalStorage('currentUser', user);
		return user;
	});
};

export function upvoteComment(
	commentId: number,
	upvotedComments: number[] = [],
	downvotedComments: number[] = []
) {
	if (downvotedComments.includes(commentId)) {
		updateUserVotes('downvotedComments', true, commentId);
		updateScore(1, commentId);
	} else if (!upvotedComments.includes(commentId)) {
		updateUserVotes('upvotedComments', false, commentId);
		updateScore(1, commentId);
	} else if (upvotedComments.includes(commentId)) {
		updateUserVotes('upvotedComments', true, commentId);
		updateScore(-1, commentId);
	}
}

export function downvoteComment(
	commentId: number,
	upvotedComments: number[] = [],
	downvotedComments: number[] = []
) {
	if (upvotedComments.includes(commentId)) {
		updateUserVotes('upvotedComments', true, commentId);
		updateScore(-1, commentId);
	} else if (!downvotedComments.includes(commentId)) {
		updateUserVotes('downvotedComments', false, commentId);
		updateScore(-1, commentId);
	} else if (downvotedComments.includes(commentId)) {
		updateUserVotes('downvotedComments', true, commentId);
		updateScore(1, commentId);
	}
}
