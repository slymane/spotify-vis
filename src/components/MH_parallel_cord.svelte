<script>
    import { scaleLinear, scaleOrdinal } from "d3-scale";
	import { schemeCategory10 } from "d3-scale-chromatic";
    import { addedTracks, recommendedTracks, seededTracks } from '../stores.js';

    let songs;
    addedTracks.subscribe(v => {songs = v});
    // console.log(songs);
    // let recTracks;
    // recommendedTracks.subscribe(v => {recTracks = v});

    // let seedTracks;
    // seededTracks.subscribe(v => {seedTracks = v});
    let feature_name_list =[
            {name:"acousticness",feature_checkbox:true},
            {name:"danceability",feature_checkbox:true},
            {name:"energy",feature_checkbox:true},
            {name:"instrumentalness",feature_checkbox:true},
            {name:"liveness",feature_checkbox:true},
            {name:"loudness",feature_checkbox:true},
            {name:"popularity",feature_checkbox:true},
            {name:"speechiness",feature_checkbox:true},
            {name:"valence",feature_checkbox:true},
        ];
    $: checkedFeatures = feature_name_list.map(function(item){
        if(item.feature_checkbox===true){
            return item.name;
        }
        else{
            return null;
        }      
    });

    let xLeft=70;
    let xRight=980;
    let bar_base=470;
    let bar_top=70;
    let totalWidth=xRight-xLeft;
    let eachWidth=totalWidth/9;
    let chartWidth;
    let barHeight=(bar_top-bar_base);
    let yScaleTicks=[];
    let yScaleNew;
    let featureArray=[];
    let count=0;
    let num_features;
    let chartPos;
    let index;
    let midPoint;
    let lastPos;
    let nextFeature;
    let colorScale;
    let lineSelect=false;
    let selectedSong=null;
    let min_value=0;
    let max_value=1;
    let norm_value=0;
    let next_F;
    
    const attrsShort = [
        'acoustic', 'dance.', 'energy', 'instru.', 'liveness', 
        'loud.', 'pop.', 'speech.', 'valence'
    ];

    yScaleNew=scaleLinear()
			.domain([0,1]);
    yScaleTicks=yScaleNew.ticks(20);
    colorScale = scaleOrdinal(schemeCategory10)
			.domain(songs.map(song => song["id"]));

    function makeFeatureArray(checkedFeatures){
        featureArray=[];
        checkedFeatures.forEach(element => {
            if (element!=null){
                featureArray.push(element);
            }
        });
        return featureArray;
    }

    function countChart(checkedFeatures){
        count=0;
        checkedFeatures.forEach(element => {
            if (element!=null){
                count=count+1;
            }
        });
        return (count);
    }
    function countIndex(checkedFeatures,feature){
        featureArray=makeFeatureArray(checkedFeatures);
        index=featureArray.indexOf(feature);
        return index;
    }
    function positionCalculation(checkedFeatures, feature){
        num_features=countChart(checkedFeatures);
        chartWidth=eachWidth*(num_features-1);
        midPoint=(totalWidth-chartWidth)/2;
        chartPos=(midPoint+(countIndex(checkedFeatures,feature)*eachWidth));
        return chartPos;
    }
    function lastPosition(checkedFeatures,feature){
        featureArray=makeFeatureArray(checkedFeatures);
        index=featureArray.indexOf(feature);
        if (index==(featureArray.length-1)) {
            return feature;
        }
        else{
            return "not";
        }   
    }
    function nextFeatureFind(checkedFeatures,feature){
        featureArray=makeFeatureArray(checkedFeatures);
        index=featureArray.indexOf(feature);
        nextFeature=featureArray[index+1];
        return nextFeature;
    }
    function singleLengthFind(checkedFeatures){
        featureArray=makeFeatureArray(checkedFeatures);
        return featureArray.length;
    }
    function normalizedValue(feature, value){
        if(feature == "loudness"){
            min_value=0;
            max_value=60;
            norm_value=(Math.abs(value)-min_value)/(max_value-min_value);
        }
        else if (feature == "popularity"){
            min_value=0;
            max_value=100;
            norm_value=(Math.abs(value)-min_value)/(max_value-min_value);
        }
        else{
            min_value=0;
            max_value=1;
            norm_value=(Math.abs(value)-min_value)/(max_value-min_value);
        }
        return norm_value;
    }   

</script>

<div id="parallelCoordinates">
    <div class="chart">
        <svg id="svgCharts"
            viewBox="-20 0 1000 600"
            preserveAspectRatio="xMinYMid meet"
        >
            <g id="chartView">
                <!-- baseline -->
                <line class="axis" x1={xLeft} y1={bar_base} x2={xRight} y2={bar_base}/>
                <!-- drawing each vertical line -->
                {#each checkedFeatures as feature,i}
                    {#if feature!=null}
                        <line class="axis" x1={xLeft+positionCalculation(checkedFeatures,feature)} 
                        y1={bar_base} x2={xLeft+positionCalculation(checkedFeatures,feature)} y2={bar_top}
                        />
                        <text class="x_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-20} y={bar_base+20}>{attrsShort[checkedFeatures.indexOf(feature)]}</text>
                        <text class="y_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-25} y={bar_base-2}>0.0</text>
                        <text class="y_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-25} y={bar_top+2}>1.0</text>
                        <text class="y_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-25} y={bar_base+(barHeight/2)}>0.5</text>
                    
                        {#each yScaleTicks as tick}
                            <line class="yaxis" x1={xLeft+positionCalculation(checkedFeatures,feature)-5} y1={bar_base+(tick*barHeight)} x2={xLeft+positionCalculation(checkedFeatures,feature)+5} y2={bar_base+(tick*barHeight)}/>
                            <!-- <text class="y_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-30} y={bar_base+(tick*barHeight)}> {tick} </text>> -->
                        {/each}
                    {/if}    
                {/each}
                <!-- drawing value lines -->
                {#each songs as song,i}
                    {#each checkedFeatures as feature,j}
                        {#if feature!=null}
                            {#if feature!=lastPosition(checkedFeatures, feature)}
                                <line class="value_lines {lineSelect!=false ? selectedSong==songs[i]["id"] ? "this-one-selected":"this-one-not-selected":"pre-selected"}" 
                                x1={xLeft+positionCalculation(checkedFeatures,feature)}  
                                y1={bar_base+(normalizedValue(feature,songs[i][feature])*barHeight)} 
                                x2={xLeft+positionCalculation(checkedFeatures,feature)+eachWidth}
                                y2={bar_base+(normalizedValue(nextFeatureFind(checkedFeatures,feature),songs[i][nextFeatureFind(checkedFeatures,feature)])*barHeight)}      
                                style="stroke: {colorScale(songs[i]["id"])};"
                                on:mouseenter={()=>{
                                    selectedSong=songs[i]["id"];
                                    lineSelect=true;
                                }}
                                on:mouseleave={()=>{
                                   lineSelect=false;
                                }}
                                />
                            {:else if singleLengthFind(checkedFeatures)==1}
                                <circle class="circleValue" cx={xLeft+positionCalculation(checkedFeatures,feature)}
                                cy={bar_base+(normalizedValue(feature,songs[i][feature])*barHeight)} r="6" style="fill: {colorScale(songs[i]["id"])};"
                                />
                            {/if}
                        {/if}
                    {/each}
                {/each}

            </g>
        </svg>
    </div>
    <!-- displaying the feature name -->
    <div id="feature">
        {#each feature_name_list as {name, feature_checkbox}}
            <div id="eachFeature">
                <p id="featureText">
                    <input id="feature_checkbox" type=checkbox bind:checked={feature_checkbox}> {name}
                </p>
            </div>
        {/each}
    </div>
</div>

<style>
#parallelCoordinates{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
}
.chart{
    display: flex;
	width: 75%;
    height: 100%;
	overflow: hidden;
    
}
#feature{
    display: flex;
    width: 25%;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
}
#eachFeature{
    display: flex;
    margin-bottom: -25px;
}
#featureText{
    font-size: x-large;
}
.x_labels{
    font-size: large;
}
.y_labels{
    font-size:medium;
}
.axis{
		stroke: black;
		stroke-width: 2;
	}
.yaxis{
		stroke: black;
		stroke-width: 1;
	}
line.value_lines{
    stroke-width: 3; 
    stroke-opacity: 0.75;  
}
line.pre-selected{
    stroke-width: 2; 
    stroke-opacity: 0.75;  
}
line.this-one-selected{
    stroke-width: 3; 
    stroke-opacity: 1;
}
line.this-one-not-selected{
    stroke-width: 1; 
    stroke-opacity: 0.2;
}
#feature_checkbox{
    cursor: pointer;
}
.circleValue{
    stroke-width: 1;
    fill-opacity: 1;
}
</style>
