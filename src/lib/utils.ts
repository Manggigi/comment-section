import jsonData from '$lib/data/data.json';

export const getTimeAgo = (created_at: Date | string): string => {
	if (!created_at) return 'Invalid Date';

	const currentTime = new Date();
	const previousTime = new Date(created_at);

	const timeDifference = Math.abs(currentTime.getTime() - previousTime.getTime()); // Difference in milliseconds

	// Calculate the difference in minutes, hours, days, and years
	const minutes = Math.floor(timeDifference / (1000 * 60));
	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
	const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30 * 12));

	// Return the appropriate time ago string
	if (minutes < 1) {
		return 'Just now';
	} else if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
	} else if (hours < 24) {
		return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	} else if (days < 30) {
		return `${days} day${days === 1 ? '' : 's'} ago`;
	} else if (months < 12) {
		return `${months} month${months === 1 ? '' : 's'} ago`;
	} else {
		return `${years} year${years === 1 ? '' : 's'} ago`;
	}
};

export const setLocalStorage = (key: string, value: any) => {
	window.localStorage.setItem(key, JSON.stringify(value));
};

export const initializeComments = () => {
	const storedComments = localStorage.getItem('commentsData');
	if (storedComments && JSON.parse(storedComments).length > 0) {
		return JSON.parse(storedComments);
	}
	return jsonData.comments;
};

export const initializeCurrentUser = () => {
	const storedUser = localStorage.getItem('currentUser');
	if (storedUser) {
		return JSON.parse(storedUser);
	}
	return jsonData.currentUser;
};
