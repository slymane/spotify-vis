<script>
    import { scaleLinear, scaleOrdinal } from "d3-scale";
	import { schemeCategory10 } from "d3-scale-chromatic";
    let feature_name_list =[
            {name:"acousticness",feature_checkbox:false},
            {name:"danceability",feature_checkbox:true},
            {name:"energy",feature_checkbox:false},
            {name:"instrumentalness",feature_checkbox:false},
            {name:"liveness",feature_checkbox:false},
            {name:"loudness",feature_checkbox:false},
            {name:"popularity",feature_checkbox:false},
            {name:"speechiness",feature_checkbox:false},
            {name:"valence",feature_checkbox:false},
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
    let bar_base=370;
    let bar_top=70;
    let totalWidth=xRight-xLeft;
    let eachWidth=totalWidth/9;
    let chartWidth;
    let tickWidth=(bar_top-bar_base);
    let yScaleTicks=[];
    let yScaleNew;
    let featureArray=[];

    let count=0;
    let num_features;
    let chartPos;
    let index;
    let midPoint;
    const attrsShort = [
        'acoustic', 'dance.', 'energy', 'instru.', 'liveness', 
        'loud.', 'pop.', 'speech.', 'valence'
    ];

    yScaleNew=scaleLinear()
			.domain([0,1]);
    yScaleTicks=yScaleNew.ticks(20)


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
    
</script>

<div id="parallelCoordinates">
    <div id="chart">
        <!-- {#if checkedFeatures.some(el => el !== null)}
            {#each checkedFeatures as feature}
                {#if feature!=null}
                    <p>{feature}</p>
                {/if}
            {/each}
            
        {/if} -->
        <svg id="svgCharts">
            <g id="chartView">
                <line class="axis" x1={xLeft} y1={bar_base} x2={xRight} y2={bar_base}/>
                {#each checkedFeatures as feature,i}
                    {#if feature!=null}
                        <line class="axis" x1={xLeft+positionCalculation(checkedFeatures,feature)} y1={bar_base} x2={xLeft+positionCalculation(checkedFeatures,feature)} y2={bar_top}/>
                        <text class="x_labels" x={xLeft+positionCalculation(checkedFeatures,feature)-20} y={bar_base+20}>{attrsShort[checkedFeatures.indexOf(feature)]}</text>
                        {#each yScaleTicks as tick}
                            <line class="axis" x1={xLeft+positionCalculation(checkedFeatures,feature)-5} y1={bar_base+(tick*tickWidth)} x2={xLeft+positionCalculation(checkedFeatures,feature)+5} y2={bar_base+(tick*tickWidth)}/> 
                        {/each}  
                    {/if}
                    
                {/each}
            </g>
        </svg>
    </div>
    <!-- on:click={() => console.log(checkedFeatures)} -->
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
    flex-direction: row;
}
#chart{
    display: flex;
    width: 75%;
}
#svgCharts{
    width: 100%;
}
/* #chartView{
    width: 100%;
    height: 50%;
} */

#feature{
    display: flex;
    width: 25%;
    flex-direction: column;
}
#eachFeature{
    display: flex;
    margin-bottom: -25px;
}
#featureText{
    font-size: x-large;
}
.view-panel {
		border: 2px solid #eee;
        margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 5px;
}
.x_labels{
    font-size: large;
}
.axis{
		stroke: black;
		stroke-width: 2;
	}
</style>