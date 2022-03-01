<script>
	import { onMount } from "svelte";
	import { scaleLinear } from "d3-scale";

	let instances = new Array();

	onMount(async () => {
		const fetched = await fetch("./static/prediction_results.json");
		instances = (await fetched.json()).test_instances;
		console.log(instances);
	});
</script>

<main>
    <h1>Hello World</h1>
</main>

<style>

</style>
