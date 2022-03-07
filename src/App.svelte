<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import SongSearchListBar from "./components/HM_song_search_list_bar.svelte";
  import BarCharts from "./components/HM_bar_charts.svelte";
  import CircleOfFifth from "./components/MM_circle_of_fifth.svelte";
  import Timeline, { history } from "./components/MM_timeline.svelte";
  import ParallelCoordinates from "./components/MH_parallel_cord.svelte";
  import Recommend from "./components/ES_recomended_filters_Search.svelte";
  import { recommendedTracks } from "./stores.js";

  let recTracks;
  recommendedTracks.subscribe((v) => {
    recTracks = v;
  });

  let artists;
  let tracks;

  onMount(async () => {
    // Load artists csv
    artists = await d3.csv("static/csv/artists.csv");
    tracks = await d3.csv("static/csv/tracks.csv");
    console.log(artists);
    console.log(tracks);
  });
</script>

<main>
  <div id="main">
    <div id="search_and_charts">
      <div id="searchList_and_circle">
        <div style="height: 66%;" class="view-panel">
          <SongSearchListBar />
        </div>
        <div style="height: 33%;" class="view-panel">
          <CircleOfFifth />
        </div>
      </div>

      <div id="barChart_and_parCord">
        <div style="height: 33%;" class="view-panel">
          <BarCharts />
        </div>
        <div style="height: 66%;" class="view-panel">
          <ParallelCoordinates />
        </div>
      </div>
    </div>

    <div id="timeline_and_recommend">
      <div style="width: 25%;" class="view-panel">
        <Timeline />
      </div>
      <div style="width: 75%;" class="view-panel">
        <Recommend />
      </div>
    </div>
  </div>
</main>

<style>
  #main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 1200px;
  }
  #search_and_charts {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 66%;
  }
  #searchList_and_circle {
    display: flex;
    flex-direction: column;
    width: 25%;
    height: 100%;
  }
  #barChart_and_parCord {
    display: flex;
    flex-direction: column;
    width: 75%;
    height: 100%;
  }
  #timeline_and_recommend {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 33%;
  }

  .view-panel {
    border: 2px solid #eee;
    margin-bottom: 5px;
    margin-right: 5px;
  }
</style>
