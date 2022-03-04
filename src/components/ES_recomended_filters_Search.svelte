<script>
    import { spotifyApi } from '../api.js';
    import RangeSlider from "svelte-range-slider-pips";

    const a = ['bad'];

	// Example grabbing elvis albums
	spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
		if (err) console.error(err);
		else console.log('Artist albums', data);
	});

    // import DoubleRangeSlider from './DoubleRangeSlider.svelte';
    // let start;
    // let end;

    let min = 50;
    let max = 50;

</script>

<div id="recommend">
    <div id="sliders">
        Sliders
    </div>
    
    <!--
    <div id='sliders'>
        <span class='slider'>
            <RangeSlider class="rangeSlider" values={[0.0, 1.0]} min={0} max={1} step={0.01} pipstep={5} first='label' last='label'
                formatter={(v,i,p) => v.toFixed(2)} pips vertical float range/>
            </span>
        <span class='slider-label'>Sometext</span>
    </div>
    -->
    <div id="runrec">
        Run reccomender
    </div>
</div>

<style>
    #recommend{
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #sliders {
        width: 60%;
		margin-right: 2.5px;
    }

    #runrec {
        width: 40%;
        margin-left: 2.5px;
    }

    .slider {
        position: absolute;
    }

    .slider-label {
        position: relative;
        top: 5%;
    }

</style>
