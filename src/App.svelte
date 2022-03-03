<script>
	import { onMount } from "svelte";
	import * as d3 from 'd3';
	import { spotifyApi } from './api.js';
	import SongSearchListBar from './components/HM_song_search_list_bar.svelte';
	import BarCharts from './components/HM_bar_charts.svelte';
	import CircleOfFifth from './components/MM_circle_of_fifth.svelte';
	import Timeline from './components/MM_timeline.svelte';
	import ParallelCoordinates from './components/MH_parallel_cord.svelte';
	import Recommend from  './components/ES_recomended_filters_Search.svelte';

	let artists = new Array();
	let tracks = new Array();

	onMount(async () => {
		// Load artists csv
		artists = await d3.csv('static/csv/artists.csv');
		tracks = await d3.csv('static/csv/tracks.csv')
		console.log(artists);
		console.log(tracks);
	});
</script>

<main>
    <div id="main">
		<div id="search_and_charts">
			<div id="searchList_and_circle">
				<div id="SongSearchListBar" class="view-panel">
					<SongSearchListBar/>
				</div>
				<div id="CircleOfFifth" class="view-panel">
					<CircleOfFifth/>
				</div>
			</div>
			<div id="barChart_and_parCord">
				<div id="BarCharts" class="view-panel">
					<BarCharts/>
				</div>
				<div id="parallelCoordinates" class="view-panel">
					<ParallelCoordinates/>	
				</div>
			</div>
		</div>
		<div id="timeline_and_recommend">
			<div id="timeline" class="view-panel">
				<Timeline/>
			</div>
			<div id="recommend" class="view-panel">
				<Recommend/>
			</div>
		</div>
		

	</div>

</main>

<style>
#main{
	display: flex;
	flex-direction: column;
	width: 1200px;
}
#search_and_charts{
	display: flex;
	flex-direction: row;
	width: 1200px;
}
#searchList_and_circle{
	display: flex;
	flex-direction: column;
	width: 300px;
}
#barChart_and_parCord{
	display: flex;
	flex-direction: column;
	width: 900px;
}
#timeline_and_recommend{
	display: flex;
	flex-direction: row;
	width: 1200px;
}

/* #BarCharts{
	display: flex;
} */
/* #CircleOfFifth{
	display: flex;
} */
.view-panel {
		border: 2px solid #eee;
		margin-bottom: 5px;
		margin-right: 5px;
}


</style>
