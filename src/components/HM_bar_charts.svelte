<script>
    import { addedTracks } from '../stores.js';
    import { scaleLinear } from 'd3-scale';

    let addTracks;
    let graphedTracksArtists;
	let graphedTracksTime;
	let graphedTracksArtistsTop;
	let graphedTracksTimeTop;
    addedTracks.subscribe((v) => {
        addTracks = v;
        graphedTracksArtists = findOcc(addTracks,"artist");
		graphedTracksArtists.sort(function (artist1, artist2) {
				if (artist1.occurrence > artist2.occurrence) return -1;
				if (artist1.occurrence < artist2.occurrence) return 1;
				if (artist1.artist > artist2.artist) return -1;
				if (artist1.artist < artist2.artist) return 1;
			});
		graphedTracksTime = findOcc(addTracks,"time_signature");
		graphedTracksTime.sort(function (time1, time2) {
				if (time1.occurrence > time2.occurrence) return -1;
				if (time1.occurrence < time2.occurrence) return 1;
				if (time1.time_signature > time2.time_signature) return -1;
				if (time1.time_signature < time2.time_signature) return 1;
			});
		graphedTracksArtistsTop=graphedTracksArtists.slice(0,6);
		graphedTracksTimeTop=graphedTracksTime.slice(0,6);
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

	let width = 200;
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

<div class="chart" bind:clientWidth={width} bind:clientHeight={height} word-wrap="break-word">
	<svg  transform="translate(-350,35)">
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
			{#each graphedTracksArtistsTop as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-6" word-wrap="break-word">{width > 380 ? point.artist : formatMobile(point.artist)}</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each graphedTracksArtistsTop as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScale(point.occurrence)}"
					width="{barWidth - 4}"
					height="{yScale(0) - yScale(point.occurrence)}"
				></rect>
			{/each}
		</g>
	</svg> 

	<svg transform="translate(250,-169)">
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
			{#each graphedTracksTimeTop as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-6">{width > 380 ? point.time_signature : formatMobile(point.time_signature)}</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each graphedTracksTimeTop as point, i}
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
        height: 50%;
    }
    .container {
    display: auto;
    width: 100%;
    height: 150px;
    }

    .chart {
		width: 100%;
		max-width: 500px;
		height: 75%;
		margin: 0 auto;
	}

	svg {
		position: auto;
		width: 100%;
		height: 200px;
		word-wrap: break-word;
		
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
		fill: #8DA0CB;
		stroke: none;

	}
</style>
