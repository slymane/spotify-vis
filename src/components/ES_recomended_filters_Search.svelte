<script>
    import { spotifyApi } from '../api.js';
    import {recommendedTracks} from '../stores.js';
    import RangeSlider from "svelte-range-slider-pips";

    // State values
    const attrs = [
        'acousticness', 'danceability', 'energy', 'instrumentalness', 'liveness', 
        'loudoudness', 'popularity', 'speechiness', 'valence'];
    const attrsShort = [
        'acoustic', 'dance.', 'energy', 'instru.', 'liveness', 
        'loud.', 'pop.', 'speech.', 'valence'
    ];
    let isEnabled = {};
    attrs.forEach(a => {isEnabled[a] = true});

    let values = {};
    attrs.forEach(a => {values[a] = [0.0, 1.0]});

    let recMethod = 'replace';
    let numTracks = 1;

    // TODO: Will need to pull these from HM song search
    const tracks = ['3Ym9KAplnUsm8kIrwETUBy', '2W889aLIKxULEefrleFBFI', '10EtiDDUz7GoRRpGD3vQpj'];

    function handleRec() {
        let seedJSON = {
            'seed_tracks': tracks,
            'limit': numTracks,
        }
        attrs.forEach(attr => {
            seedJSON['min_' + attr] = values[attr][0];
            seedJSON['max_' + attr] = values[attr][1];
        })

        console.log("Getting Recommendations: ", seedJSON)
        spotifyApi.getRecommendations(seedJSON, function(err, data) {
            if (err) {
                console.error(err);
            } else {
                console.log(data.tracks);
                recommendedTracks.set(data.tracks);
            }
        });
    }

</script>

<div id="recommend">
    <div id="sliders">
        {#each attrs as attr, i}
            <span class='slider' style='width: {100 / attrs.length}%'>
                <span class='range'>
                    <RangeSlider id='rs-{attr}' bind:values={values[attr]} min={0} max={1} step={0.01} pipstep={5}
                        formatter={(v,i,p) => v.toFixed(2)}  pips vertical float range
                        disabled={!isEnabled[attr]} hoverable={isEnabled[attr]}/>   
                </span>
                <label>
                    <input type=checkbox bind:checked={isEnabled[attr]}>
                    <span class:disabled={!isEnabled[attr]}>{attrsShort[i]}</span>
                </label>
            </span>
        {/each}
    </div>

    <div id="runrec">
        {#each Array(5) as _, i}
            <div class='seed-track'>{i < tracks.length ? tracks[i] : 'N/A'}</div>
        {/each}

        <div style='margin-top: 5%;'>
            <label>
                <input type=radio bind:group={recMethod} name="recmethod" value={'replace'}>
                replace selection
            </label>
            
            <label>
                <input type=radio bind:group={recMethod} name="recmethod" value={'add'}>
                add to selection
            </label>
        </div>
        <button id='rec-button' on:click={handleRec}>Reccomend!</button>
        <label>
            <input type=number bind:value={numTracks} min=1 max=100>
        </label>
    </div>
</div>

<style>
    #recommend{
        display: flex;
        flex-direction: row;
        height: 100%;
    }

    #sliders {
        display:flex;
        flex-direction: row;
        width: 70%;
		margin-right: 2.5px;

    }

    #runrec {
        width: 30%;
        margin-left: 2.5px;
        text-align: center;
    }

    #rec-button {
        border: none;
        margin: 2px auto 2px auto;
        background-color: black;
        border:0.1em solid gray;
        color:white;
        transition: all 0.25s;
        font-size: 1em;
    }

    #rec-button:hover{
        color: white;
        background-color:gray;
    }

    .disabled {
        color: gray;
    }

    .slider {
        flex-direction: column;
        text-align: center;
    }

    .range {
        display: table;
        margin: 0 auto;
    }

    .seed-track {
        width: 80%;
        margin: 2px auto 2px auto;
        padding: 5px;
        text-align: center;
        color: #FFFFFF;
        background-color: #66C2A5;
    }
</style>
