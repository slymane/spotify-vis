<script>
	import { onMount } from "svelte";
	import * as d3 from 'd3'

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
    <h1>Hello World</h1>
</main>

<style>

</style>
