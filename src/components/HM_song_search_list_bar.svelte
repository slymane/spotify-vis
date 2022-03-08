<script>
    import { onMount } from "svelte";
    import { addedTracks, seededTracks, recommendedTracks } from '../stores.js';
    import * as d3 from "d3";

    let searchName = "";
    let tracks = [];    
    $: filteredTracks = tracks.filter(function(track) {
        let search = searchName.toLowerCase();
        let nameMatch = track.name.toLowerCase().indexOf(search) != -1;
        let artistMatch = track.artists.toLowerCase().indexOf(search) != -1;
        return nameMatch || artistMatch;
    }).sort(function(a, b) {
        if ( a.popularity < b.popularity ){
            return -1;
        }
        else if ( a.popularity > b.popularity ){
            return 1;
        } else {
            return 0;
        }
    }).reverse().slice(0, 20);

    function artists2artist(s) {
        s = s.slice(1, -1);
        s = s.split(',');
        return s[0].slice(1, -1);
    }

    function addTrack(track) {
        addedTracks.update(v => [...v, track]);
    }

    onMount(async () => {
        tracks = await d3.csv("static/csv/tracks.csv");
        tracks = tracks.filter(e => e.name != "");
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].artist = artists2artist(tracks[i].artists);
        }
        tracks = tracks.sort(function(a, b) {
            if ( a.name < b.name ){
                return -1;
            }
            else if ( a.name > b.name ){
                return 1;
            } else {
                return 0;
            }
        });
    });
</script>

<div id="SongSearchListBar">
    <input bind:value={searchName}>
    <div id="track-list">
        {#each filteredTracks as track}
            <div class="track">
                {track.name} - {track.artist} <br>
                <button on:click={addTrack(track)}>Add Track</button>
            </div>
        {/each}
    </div>
</div>

<style>
    #SongSearchListBar {
        margin: auto;
        padding: 5px;
        height: 100%;
    }

    #track-list {
        height: 94%;
        display: block;
        overflow: scroll;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .track {
        border: 2px solid #eee;
        margin-top: 4px;
    }
</style>
