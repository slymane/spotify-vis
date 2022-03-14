<script>
    import { addedTracks } from '../stores.js';
    import { scaleLinear } from 'd3-scale';

    let addTracks;
    let graphedTracksArtists;
	let graphedTracksTime;
	let graphedTracksArtistsTop;
	let graphedTracksTimeTop;
	let artYTicks;
	let timeYTicks;
	let max1;
	let max2;
    addedTracks.subscribe((v) => {
        addTracks = v;
        graphedTracksArtists = findOcc(addTracks,"artist");
		graphedTracksArtists.sort(function (artist1, artist2) {				
				if (artist1.occurrence > artist2.occurrence) return -1;
				if (artist1.occurrence < artist2.occurrence) return 1;
				if (artist1.artist > artist2.artist) return 1;
				if (artist1.artist < artist2.artist) return -1;
			});
			
		graphedTracksTime = findOcc(addTracks,"time_signature");
		graphedTracksTime.sort(function (time1, time2) {
				if (time1.occurrence > time2.occurrence) return -1;
				if (time1.occurrence < time2.occurrence) return 1;
				if (time1.time_signature > time2.time_signature) return -1;
				if (time1.time_signature < time2.time_signature) return 1;
			});
		artYTicks = [0, 0.25,0.5,0.75,1];
		timeYTicks = [0, 0.25,0.5,0.75,1];
		graphedTracksArtistsTop=graphedTracksArtists.slice(0,5);
		graphedTracksTimeTop=graphedTracksTime.slice(0,5);
		if ((graphedTracksArtistsTop[0] !== undefined)){
			max1 = graphedTracksArtistsTop[0].occurrence
			max2 = graphedTracksTimeTop[0].occurrence
			artYTicks=[0,max1/4,max1/2,(3*max1)/4,max1];
			timeYTicks=[0,max2/4,max2/2,(3*max2)/4,max2];
		}

		
		
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
	const xTicks = [1, 2, 3, 4, 5];
	const padding = { top: 20, right: 15, bottom: 40, left: 25 };

	let width = 200;
	let height = 200;

	function formatMobile(tick) {
		return tick.toString().slice(0,8) +"..." ;
	}

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScaleArt = scaleLinear()
		.domain([0, Math.max.apply(null, artYTicks)])
		.range([height - padding.bottom, padding.top]);

	$: yScaleTime = scaleLinear()
		.domain([0, Math.max.apply(null, timeYTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<div class="chart" bind:clientWidth={width}  word-wrap="break-word">
	<svg  transform="translate(-400,35)">
		<!-- y axis -->
		<g class="axis y-axis">
			{#each artYTicks as tick, tickMax}
				<g class="tick tick-{tick}" transform="translate(0, {yScaleArt(tick)})">
					<line x2="100%"></line>
					<text y="-4">{tick} </text>
				</g>
			{/each}
			<text y="16" x="30" style="font-family: Helvetica, Arial; font-size: .725em; font-weight: 200; fill: #ccc;">Occurances </text>
			
			
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each graphedTracksArtistsTop as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-25" >{width < 160 ? point.artist : formatMobile(point.artist)}</text>
				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each graphedTracksArtistsTop as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScaleArt(point.occurrence)}"
					width="{barWidth - 4}"
					height="{yScaleArt(0) - yScaleArt(point.occurrence)}"
				></rect>
			{/each}
		</g>
		<text y="195" x="175" style="font-family: Helvetica, Arial; font-size: .725em; font-weight: Bold; fill: black;">Top 5 Artists by # Occurances </text>
	</svg> 

	<svg transform="translate(250,-169)">
		<!-- y axis -->
		<g class="axis y-axis">
			{#each timeYTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScaleTime(tick)})">
					<line x2="100%"></line>
					<text y="-4">{tick}</text>
				</g>
			{/each}
			<text y="16" x="30" style="font-family: Helvetica, Arial; font-size: .725em; font-weight: 200; fill: #ccc;">Occurances </text>
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each graphedTracksTimeTop as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x="{barWidth/2}" y="-25">{width > 380 ? point.time_signature : formatMobile(point.time_signature)}/4</text>

				</g>
			{/each}
		</g>

		<g class='bars'>
			{#each graphedTracksTimeTop as point, i}
				<rect
					x="{xScale(i) + 2}"
					y="{yScaleTime(point.occurrence)}"
					width="{barWidth - 4}"
					height="{yScaleTime(0) - yScaleTime(point.occurrence)}"
				></rect>
			{/each}
		</g>
		<text y="195" x="150" style="font-family: Helvetica, Arial; font-size: .725em; font-weight: Bold; fill: black;">Top 5 Time Signatures by # Occurances </text>
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
		overflow-wrap: break-word;
		
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
		overflow-wrap: break-word;
		
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
		overflow-wrap: break-word;
		width: 50px;
		word-wrap: break-word;
	}

	.bars rect {
		fill: #8DA0CB;
		stroke: none;

	}
</style>
