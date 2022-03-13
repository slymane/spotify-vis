<script>
  // export let keyFrequencies;

  import * as d3 from "d3";
  import { scaleSequential } from "d3-scale";
  import { addedTracks } from "../stores";

  // Dictionary used to translate a track's key and mode to the correct order
  // to generate the circle of fifths.
  let keyFrequencies = {
    C: 0,
    G: 0,
    D: 0,
    A: 0,
    E: 0,
    B: 0,
    Gb: 0,
    Db: 0,
    Ab: 0,
    Eb: 0,
    Bb: 0,
    F: 0,
    Am: 0,
    Em: 0,
    Bm: 0,
    "F#m": 0,
    "C#m": 0,
    "G#m": 0,
    "D#m": 0,
    "A#m": 0,
    Fm: 0,
    Cm: 0,
    Gm: 0,
    Dm: 0,
  };

  // TODO: Create a array that can translate the Spotify key and mode to the keys in the correct order for cofFormat
  // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features

  // Spotify doesn't use every key, so we need to map the keys to the ones that are used
  let spotifyFormat = [
    // Mode = 1
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
    // Add 12 if mode is 0 to get the correct key
    "Cm",
    "C#m",
    "Dm",
    "D#m",
    "Em",
    "Fm",
    "F#m",
    "Gm",
    "G#m",
    "Am",
    "A#m",
    "Bm",
  ];

  // Covert key frequencies to an iterable array of tuples
  var keyEntries = Object.entries(keyFrequencies);

  // Generate heatmap colors from 0 to the current maximum frequency
  var heatmapColorScale = scaleSequential(d3.interpolateInferno).domain([
    0,
    d3.max(keyEntries, (d) => d[1]),
  ]);

  // Generate heatmap data for each key
  // Spotify tracks by pitch class and mode, it will need to be translated.
  addedTracks.subscribe((tracks) => {
    // Reset keyFrequencies
    for (let key in keyFrequencies) {
      keyFrequencies[key] = 0;
    }

    // Translate the key frequencies from Spotify to the ones used by CoF
    tracks.forEach((track) => {
      addTrackToCOF(track);
    });

    // Turn the object into an itterable array of tuples
    keyEntries = Object.entries(keyFrequencies);

    // Regenerate the color scale
    heatmapColorScale = scaleSequential(d3.interpolateInferno).domain([
      0,
      d3.max(keyEntries, (d) => d[1]),
    ]);
  });

  // Helper function for generating the circle of fifths
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  // Add data to the circle of fifths. Should only be called by addedTracks.subscribe()
  function addTrackToCOF(track) {
    let spotify_idx;
    if (
      track.key === -1 ||
      track.mode === -1 ||
      track.key === undefined ||
      track.mode === undefined
    ) {
      // If the key is -1, then the track doesn't have a key
      return;
    }
    if (Number(track.mode) === 1) {
      // If mode is 1, the key is major
      spotify_idx = Number(track.key);
    } else {
      // If mode is 0, the key is minor
      spotify_idx = Number(track.key) + 12;
    }

    // Add the track to the correct key
    if (keyFrequencies[spotifyFormat[spotify_idx]] === undefined) {
      console.log(
        "Undefined key when mode is " + track.mode + "and key is " + track.key
      );
    }
    keyFrequencies[spotifyFormat[spotify_idx]] += 1;
  }

  // Generate the circle of fifths as an array of points
  let circleOfFifths = [];

  // Major keys
  for (let i = 0; i < 12; i++) {
    // Point 1 is top left
    // Point 2 is top right, an arc connects points 1 and 2
    // Point 3 is bottom right
    // Point 4 is bottom left, an arc connects points 3 and 4. Point 4 connects back to point 1.
    // The arcs should curve outwards.
    // TODO: Add a point equidistant from points 1 and 2 for the bezier curve
    // TODO: Add a point equidistant from points 3 and 4 for the bezier curve
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
    // The arcs should curve outwards.
    // TODO: Add a point equidistant from points 1 and 2 for the bezier curve
    let point1 = polarToCartesian(50, 50, 35, i * 30 - 15);
    let point2 = polarToCartesian(50, 50, 35, i * 30 + 15);
    let point3 = { x: 50, y: 50 };
    circleOfFifths.push([point1, point2, point3]);
  }
</script>

<div id="CircleOfFifth">
  <!-- <p>HeatMap</p> -->
  <svg
    id="CircleOfFifth-SVG"
    height="100%"
    width="100%"
    viewBox="0 0 150 100"
    preserveAspectRatio="xMinYMin meet"
  >
    <g id="cof-sections">
      {#each keyEntries as keyEntry, idx}
        {#if idx < 12}
          <!-- If key is a major key -->
          <path
            id="cof-section-{keyEntry[0]}"
            d="M{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              L{circleOfFifths[idx][1].x} {circleOfFifths[idx][1].y}
              L{circleOfFifths[idx][2].x} {circleOfFifths[idx][2].y}
              L{circleOfFifths[idx][3].x} {circleOfFifths[idx][3].y}
              L{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              Z"
            stroke="white"
            stroke-width="1"
            fill={keyEntry[1] > 0 ? heatmapColorScale(keyEntry[1]) : "black"}
          />
          <text
            x={polarToCartesian(50, 50, 41, idx * 30).x}
            y={polarToCartesian(50, 50, 41, idx * 30).y}
            fill={d3.hsl(heatmapColorScale(keyEntry[1])).l > 0.5
              ? "black"
              : "white"}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="5"
          >
            {keyEntry[0]}
          </text>
        {:else}
          <!-- Else it is a minor key -->
          <path
            id="cof-section-{keyEntry[0]}"
            d="M{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              L{circleOfFifths[idx][1].x} {circleOfFifths[idx][1].y}
              L{circleOfFifths[idx][2].x} {circleOfFifths[idx][2].y}
              L{circleOfFifths[idx][0].x} {circleOfFifths[idx][0].y}
              Z"
            stroke="white"
            stroke-width="1"
            fill={keyEntry[1] > 0 ? heatmapColorScale(keyEntry[1]) : "black"}
          />
          <text
            x={polarToCartesian(50, 50, 25, idx * 30).x}
            y={polarToCartesian(50, 50, 25, idx * 30).y}
            fill={d3.hsl(heatmapColorScale(keyEntry[1])).l > 0.5
              ? "black"
              : "white"}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="5"
          >
            {keyEntry[0]}
          </text>
        {/if}
      {/each}
    </g>
    <g id="cof-legend">
      <text
        x="130"
        y="5"
        font-size="8"
        text-anchor="middle"
        dominant-baseline="central"
      >
        {d3.max(keyEntries, (d) => d[1])}</text
      >
      <image
        href="static/images/inferno.png"
        x="-90"
        y="125"
        height="100%"
        width="80"
        preserveAspectRatio="xMinYMin meet"
        transform="rotate(-90)"
      />
      <text
        x="130"
        y="95"
        font-size="8"
        text-anchor="middle"
        dominant-baseline="central">0</text
      >
    </g>
  </svg>
</div>

<style>
  #CircleOfFifth {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
