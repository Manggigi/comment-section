import data from '$lib/data/data.json';
import { writable } from 'svelte/store';
import type { Comment, User } from './types';

export const currentUser = writable<User>(data.currentUser);
export const commentsData = writable<Comment[]>([]);

// Reactive variable to control the visibility of the modal
export const showModal = writable(false);
export const modalContent = writable('');
