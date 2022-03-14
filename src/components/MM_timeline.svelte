<script>
  import { addedTracks, recommendedTracks } from "../stores.js";

  const nodeDistFromTop = 15;
  const nodeDist = 40;

  let currentState = 0;
  let timeline = [];

  // Whenever recommended tracks change, add the current state to the timeline.
  // In theory, this will only be called when the user prompts for new recommendations.
  recommendedTracks.subscribe(function () {
    // Deletes later states in the timeline
    // This is a solution that doesn't involve a lot of extra work
    // and supporting multiverse timetravel.

    if (currentState < timeline.length - 1) {
      // This is making artist and artists undefined, no idea why
      timeline.splice(currentState, timeline.length - currentState);
    }
    timeline.push({
      id: currentState,
      // This may cause an issue as it temporarily subcribes to the store, but it's probably fine
      shown_tracks: $addedTracks,
      recommended_tracks: $recommendedTracks,
    });

    // Redundant assignment to trigger Svelte's reactivity
    timeline = timeline;

    currentState++;

    console.log("subscribe - Current timeline:", timeline);
  });

  // Handles changing the current state
  function changeState(newState) {
    // Update the current state
    currentState = newState;

    // Update the stores with the new state
    addedTracks.set([...timeline[currentState].shown_tracks, "replace"]);

    // Set recommended at the end to avoid triggering the recommended tracks subscription too early
    // This doesn't assign to the artist and artists attributes, no idea why
    recommendedTracks.set([
      ...timeline[currentState].recommended_tracks,
      "replace",
    ]);

    console.log("changeState - timeline", timeline);
  }
</script>

<div id="timeline-div">
  <h2>Timeline</h2>
  {#if timeline.length > 0}
    <svg
      id="timeline-svg"
      height="100%"
      width="100%"
      viewBox="0 0 100 {nodeDist * timeline.length}"
      preserveAspectRatio="xMinYMin meet"
    >
      {#each timeline as node, i}
        <g class="timeline-item" id="timeline-node-{node.id}">
          <!-- Connecting line between nodes -->
          {#if i < timeline.length - 1}
            <line
              x1="50"
              x2="50"
              y1={nodeDistFromTop + nodeDist * i}
              y2={nodeDistFromTop + nodeDist * (i + 1)}
              style="stroke:rgb(0,0,0);stroke-width:1"
            />
          {/if}
          <!-- Draw the node -->
          <circle
            cx="50"
            cy={nodeDistFromTop + nodeDist * i}
            r="10"
            fill="green"
            stroke="black"
            stroke-width="1"
            on:click={changeState(node.id)}
          />
          <!-- Draw its label -->
          <text
            x="50"
            y={nodeDistFromTop + nodeDist * i + 3}
            font-size="10"
            text-anchor="middle"
            dominant-baseline="center"
          >
            {node.id}</text
          >
        </g>
      {/each}
    </svg>
  {/if}
</div>

<style>
  #timeline {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
