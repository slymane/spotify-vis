<script>
  import { onMount } from "svelte";
  import { addedTracks, seededTracks, recommendedTracks } from "../stores.js";
  import * as d3 from "d3";

  let searchName = "";
  let tracks = [];
  let recTracks = [];

  $: filteredTracks = tracks
    .filter(function (track) {
      let search = searchName.toLowerCase();
      let nameMatch = track.name.toLowerCase().indexOf(search) != -1;
      let artistMatch = track.artist.toLowerCase().indexOf(search) != -1;
      let inBank =
        $addedTracks.indexOf(track) != -1 ||
        $seededTracks.indexOf(track) != -1 ||
        recTracks.indexOf(track) != -1;
      return nameMatch || artistMatch || inBank;
    })
    .sort(function (a, b) {
      let inBankA =
        $addedTracks.indexOf(a) != -1 ||
        $seededTracks.indexOf(a) != -1 ||
        recTracks.indexOf(a) != -1;
      let inBankB =
        $addedTracks.indexOf(b) != -1 ||
        $seededTracks.indexOf(b) != -1 ||
        recTracks.indexOf(b) != -1;

      if (!inBankA && inBankB) {
        return -1;
      } else if (inBankA && !inBankB) {
        return 1;
      }

      if (a.popularity < b.popularity) {
        return -1;
      } else if (a.popularity > b.popularity) {
        return 1;
      } else {
        return 0;
      }
    })
    .reverse()
    .slice(0, 20);

  function artists2artist(s) {
    s = s.slice(1, -1);
    s = s.split(",");
    return s[0].slice(1, -1);
  }

  function addTrack(track) {
    addedTracks.update((v) => {
      if (v.indexOf(track) == -1) {
        return [track, ...v];
      } else {
        return v;
      }
    });
  }

  function seedTrack(track) {
    seededTracks.update((v) => {
      if (v.indexOf(track) == -1) {
        addTrack(track);
        return [track, ...v].slice(0, 5);
      } else {
        return v;
      }
    });
  }

  recommendedTracks.subscribe((v) => {
    recTracks = v;
    let mode = recTracks.pop();

    // Add song to library if not already existing
    for (let i = 0; i < recTracks.length; i++) {
      recTracks[i].artist = recTracks[i].artists[0].name;
      // recTracks[i].artists = recTracks[i].artist;
      tracks.push(recTracks[i]);
      // if (tracks.filter(e => e.id == recTracks[i].id).length == 0) {
      //     console.log(recTracks[i]);
      //     tracks.push(recTracks[i]);
      // }
    }

    if (mode == "replace") {
      addedTracks.set(recTracks);
    } else if (mode == "add") {
      recTracks.forEach((e) => addTrack(e));
    }

    seededTracks.set([]);
  });

  function removeTrack(track) {
    addedTracks.update((v) => v.filter((e) => e != track));
    seededTracks.update((v) => v.filter((e) => e != track));
  }

  onMount(async () => {
    tracks = await d3.csv("static/csv/tracks.csv");
    tracks = tracks.filter((e) => e.name != "");
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].artist = artists2artist(tracks[i].artists);
    }
    tracks = tracks.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  });
</script>

<div id="SongSearchListBar">
  <input bind:value={searchName} />
  <div id="track-list">
    {#each filteredTracks as track}
      <div class="track" class:recommended={recTracks.indexOf(track) != -1}>
        {track.name} - {track.artist} <br />
        <button
          class:added={$addedTracks.indexOf(track) != -1}
          on:click={addTrack(track)}>Add</button
        >
        <button
          class:seeded={$seededTracks.indexOf(track) != -1}
          on:click={seedTrack(track)}>Seed</button
        >
        <button on:click={removeTrack(track)}>Remove</button>
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
    margin-right: 4px;
    padding: 4px;
  }

  .added {
    color: white;
    background-color: #8da0cb;
  }

  .seeded {
    color: white;
    background-color: #66c2a5;
  }

  .recommended {
    color: white;
    background-color: #fc8d62;
  }
</style>
