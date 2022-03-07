<script>
  // export let keyFrequencies;

  import * as d3 from "d3";
  import { scaleSequential } from "d3-scale";

  // Test data
  let allKeys = {
    C: 0,
    G: 0,
    D: 0,
    A: 0,
    E: 0,
    B: 3,
    Gb: 0,
    Db: 0,
    Ab: 0,
    Eb: 1,
    Bb: 0,
    F: 0,
    Am: 0,
    Em: 0,
    Bm: 0,
    "F#m": 0,
    "C#m": 10,
    "G#m": 0,
    "D#m": 0,
    "A#m": 0,
    Fm: 0,
    Cm: 0,
    Gm: 5,
    Dm: 0,
  };

  // TODO: Replace this with a real data source
  let keyFrequencies = allKeys;

  // Covert key frequencies to an iterable object
  let keyEntries = Object.entries(keyFrequencies);

  let heatmapColorScale = scaleSequential(d3.interpolateInferno).domain([
    0,
    d3.max(keyEntries, (d) => d[1]),
  ]);

  // Helper function for generating the circle of fifths
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // Generate the circle of fifths as an array of points
  let circleOfFifths = [];

  // Major keys
  for (let i = 0; i < 12; i++) {
    // Point 1 is top left
    // Point 2 is top right, an arc connects points 1 and 2
    // Point 3 is bottom right
    // Point 4 is bottom left, an arc connects points 3 and 4. Point 4 connects back to point 1.
    // The arcs should curve outwards. May need to use quadratic beziers.
    let point1 = polarToCartesian(50, 50, 50, i * 30 - 15);
    let point2 = polarToCartesian(50, 50, 50, i * 30 + 15);
    let point3 = polarToCartesian(50, 50, 35, i * 30 + 15);
    let point4 = polarToCartesian(50, 50, 35, i * 30 - 15);
    circleOfFifths.push([point1, point2, point3, point4]);
  }

  // Minor keys
  for (let i = 12; i < 24; i++) {
    // Point 1 is top left
    // Point 2 is top right, an arc connects points 1 and 2
    // Point 3 is the center
    // The arcs should curve outwards. May need to use quadratic beziers.
    let point1 = polarToCartesian(50, 50, 35, i * 30 - 15);
    let point2 = polarToCartesian(50, 50, 35, i * 30 + 15);
    let point3 = { x: 50, y: 50 };
    circleOfFifths.push([point1, point2, point3]);
  }
</script>

<div id="CircleOfFifth">
  <!-- <p>HeatMap</p> -->
  <svg
    height="100%"
    width="auto"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <!-- Outer circle - Major -->
    <g id="cof-sections">
      {#each keyEntries as key, idx}
        {#if idx < 12}
          <!-- If key is a major key -->
          <path
            id="cof-section-{key[0]}"
            d="M{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              L{circleOfFifths[idx][1].x} {circleOfFifths[idx][1].y}
              L{circleOfFifths[idx][2].x} {circleOfFifths[idx][2].y}
              L{circleOfFifths[idx][3].x} {circleOfFifths[idx][3].y}
              L{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              Z"
            stroke="white"
            stroke-width="1"
            fill={heatmapColorScale(key[1])}
          />
          <text
            x={polarToCartesian(50, 50, 41, idx * 30).x}
            y={polarToCartesian(50, 50, 41, idx * 30).y}
            fill={d3.hsl(heatmapColorScale(key[1])).l > 0.5 ? "black" : "white"}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="5"
          >
            {key[0]}
          </text>
        {:else}
          <!-- Else it is a minor key -->
          <path
            id="cof-section-{key[0]}"
            d="M{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              L{circleOfFifths[idx][1].x} {circleOfFifths[idx][1].y}
              L{circleOfFifths[idx][2].x} {circleOfFifths[idx][2].y}
              L{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              Z"
            stroke="white"
            stroke-width="1"
            fill={heatmapColorScale(key[1])}
          />
          <text
            x={polarToCartesian(50, 50, 25, idx * 30).x}
            y={polarToCartesian(50, 50, 25, idx * 30).y}
            fill={d3.hsl(heatmapColorScale(key[1])).l > 0.5 ? "black" : "white"}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="5"
          >
            {key[0]}
          </text>
        {/if}
      {/each}
    </g>
    <!-- Key Heatmap -->
    <!-- {#each keyEntries as entry, i}
      {#if entry[1] > 0}
        <polygon
          points="50% ,50% 50%,50% 50%, 50%"
          fill={heatmapColorScale(entry[1])}
          stroke="black"
          stroke-width="2"
        />
      {/if}
    {/each} -->
  </svg>
</div>

<style>
  #CircleOfFifth {
    height: 100%;
    width: auto;
    display: flex;
    justify-content: center;
  }
</style>
