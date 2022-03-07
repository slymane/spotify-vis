<script>
    import { scaleLinear, scaleOrdinal } from "d3-scale";
	import { schemeCategory10 } from "d3-scale-chromatic";
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

    // let xLeft="5%";
    // let xRight="95%";
    // let bar_base="70%";
    // let bar_top="20%";
    // 0 to 1050 whole width
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
    
    const attrsShort = [
        'acoustic', 'dance.', 'energy', 'instru.', 'liveness', 
        'loud.', 'pop.', 'speech.', 'valence'
    ];
    let songs=[
        {
            id:1,
            acousticness:0.0,
            danceability:0.2,
            energy:0.5,
            instrumentalness:0.4,
            liveness:0.2,
            loudness:0.3,
            popularity:0.1,
            speechiness:0.4,
            valence:0.7,
        },
        {
            id:2,
            acousticness:0.3,
            danceability:0.4,
            energy:0.3,
            instrumentalness:0.6,
            liveness:0.5,
            loudness:0.1,
            popularity:0.1,
            speechiness:0.4,
            valence:0.8
        },
        {
            id:3,
            acousticness:0.5,
            danceability:0.6,
            energy:0.4,
            instrumentalness:0.4,
            liveness:0.2,
            loudness:0.5,
            popularity:0.2,
            speechiness:0.4,
            valence:0.7
        },
        {
            id:4,
            acousticness:0.7,
            danceability:0.6,
            energy:0.8,
            instrumentalness:0.4,
            liveness:0.2,
            loudness:0.6,
            popularity:0.3,
            speechiness:0.4,
            valence:0.8
        },
    ]
    yScaleNew=scaleLinear()
			.domain([0,1]);
    yScaleTicks=yScaleNew.ticks(20);
    colorScale = scaleOrdinal(schemeCategory10)
			.domain(songs.map(song => song["id"]));

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
        featureArray=[];
        checkedFeatures.forEach(element => {
            if (element!=null){
                featureArray.push(element);
            }
        });
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
        featureArray=[];
        checkedFeatures.forEach(element => {
            if (element!=null){
                featureArray.push(element);
            }
        });
        index=featureArray.indexOf(feature);
        if (index==(featureArray.length-1)) {
            return feature;
        }
        else{
            return "not";
        }   
    }
    function nextFeatureFind(checkedFeatures,feature){
        featureArray=[];
        checkedFeatures.forEach(element => {
            if (element!=null){
                featureArray.push(element);
            }
        });
        index=featureArray.indexOf(feature);
        nextFeature=featureArray[index+1];
        return nextFeature;
    }
    function singleLengthFind(checkedFeatures){
        featureArray=[];
        checkedFeatures.forEach(element => {
            if (element!=null){
                featureArray.push(element);
            }
        });
        return featureArray.length;
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
                                y1={bar_base+((songs[i][feature])*barHeight)} 
                                x2={xLeft+positionCalculation(checkedFeatures,feature)+eachWidth}  
                                y2={bar_base+((songs[i][nextFeatureFind(checkedFeatures,feature)])*barHeight)} 
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
                                cy={bar_base+((songs[i][feature])*barHeight)} r="6" style="fill: {colorScale(songs[i]["id"])};"
                                />
                            {/if}
                        {/if}
                    {/each}
                {/each}

            </g>
        </svg>
    </div>
    <div id="feature">
        {#each feature_name_list as {name, feature_checkbox}}
            <div id="eachFeature">
                <p id="featureText">
                    <input id="feature_checkbox" type=checkbox bind:checked={feature_checkbox}> {name}
                </p>
            </div>
        {/each}
    </div>
    <!-- on:click={() => console.log(checkedFeatures)} -->
</div>

<style>
#parallelCoordinates{
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;
}
.chart{
    /* display: flex;
    width:75%;
    height: 100%;
    justify-content: center; */
    display: flex;
	/* position: relative; */
	width: 75%;
    height: 100%;
	/* padding-bottom: 10%;  */
	/* vertical-align: middle;  */
	overflow: hidden;
    
}
/* #svgCharts{
    display: block;
} */
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
/* .view-panel {
		border: 2px solid #eee;
        margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
} */
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
