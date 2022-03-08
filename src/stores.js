import { writable } from 'svelte/store';

// Recommended track store
export const addedTracks = writable([]);
export const seededTracks = writable([]);
export const recommendedTracks = writable([]);

// History timeline store
export const timelineStore = writable([{
    id: 0,
    tracks: [],
    artists: [],
    childOf: null,
},
{
    id: 1,
    tracks: [],
    artists: [],
    childOf: 0,
}]);