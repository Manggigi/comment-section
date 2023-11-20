export type GenericResponse = {
	status: boolean;
	message: string;
	errors?: {
		[key: string]: unknown;
	};
	data?: {
		[key: string]: unknown;
	};
};

export type User = {
	image: {
		png: string;
	};
	username: string;
	upvotedComments?: number[];
	downvotedComments?: number[];
	upvotedReplies?: number[];
	downvotedReplies?: number[];
};

export type Comment = {
	id: number;
	content: string;
	createdAt: string | Date;
	score: number;
	user: {
		image: {
			png: string;
		};
		username: string;
	};
	replies: Reply[];
};

export type Reply = {
	id: number;
	content: string;
	createdAt: string;
	score: number;
	replyingTo: string;
	user: {
		image: {
			png: string;
		};
		username: string;
	};
};
