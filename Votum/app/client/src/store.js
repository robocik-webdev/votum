import { writable } from 'svelte/store';

export const authenticated = writable(false);
export const username = writable(null);
export const token = writable(null);
