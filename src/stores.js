import { writable } from 'svelte/store';

// Recommended track store
export const addedTracks = writable([]);
export const seededTracks = writable([]);
export const recommendedTracks = writable([]);