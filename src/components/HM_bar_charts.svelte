<script>
    import { addedTracks, seededTracks, recommendedTracks } from '../stores.js';
    import { onMount } from "svelte";
    import { scaleLinear } from 'd3-scale';

    let addTracks;
    let graphedTracksArtists;

    addedTracks.subscribe((v) => {
        addTracks = v;
        graphedTracksArtists = findOcc(addTracks,"artist");
        console.log(graphedTracksArtists);
  });   

    function findOcc(arr, key){
    let arr2 = [];
	
        arr.forEach((x)=>{
            if(arr2.some((val)=>{ return val[key] == x[key] })){
                arr2.forEach((k)=>{
                    if(k[key] === x[key]){
                    k["occurrence"]++
                    }
                })
                }else{
                let a = {}
                a[key] = x[key]
                a["occurrence"] = 1
                arr2.push(a);
                }
            })
            
            return arr2
    }

	const xTicks = [1990, 1995, 2000, 2005, 2010, 2015];
	const yTicks = [0, 5, 10, 15, 20];
	const padding = { top: 20, right: 15, bottom: 20, left: 25 };

	let width = 500;
	let height = 200;

	function formatMobile(tick) {
		return "'" + tick.toString().slice(-2);
	}

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%"></line>
					<text y="-4">{tick} {tick === 20 ? ' Occurances' : ''}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each graphedTracksArtists as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-4">{width > 380 ? point.artist : formatMobile(point.artist)}</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each graphedTracksArtists as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScale(point.occurrence)}"
					width="{barWidth - 4}"
					height="{yScale(0) - yScale(point.occurrence)}"
				></rect>
			{/each}
		</g>
	</svg>
</div>


<style>
    #BarCharts{
        height: 100%;
    }
    .container {
    display: flex;
    width: 100%;
    height: 150px;
    }

    .chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: .725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #ccc;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: #a11;
		stroke: none;
		opacity: 0.65;
	}
</style>
