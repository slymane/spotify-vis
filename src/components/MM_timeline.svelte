<!-- <script context="module">
  // Head for history tree
  // History is structured as a tree to allow for multiple "timelines"

  export class History {
    constructor() {
      this.root = null;
      this.curHistoryNode = null;
    }

    // Add a new node to the history tree
    addNode(artists, id) {
      if (this.root == null) {
        this.root = new HistoryNode(artists, id);
        this.curHistoryNode = this.root;
      } else {
        var curNode = this.root;
        while (curNode.child != null) {
          curNode = curNode.child;
        }
        curNode.child = new HistoryNode(artists, id);
      }
    }

    switchNode(id) {
      curHistoryNode = this.root;
      while (curHistoryNode.child != null) {
        if (curHistoryNode.child.id == id) {
          this.curHistoryNode = curHistoryNode.child;
          return;
        }
        curHistoryNode = curHistoryNode.child;
      }
    }

    getList() {
      var list = [];
      var curNode = this.root;
      while (curNode.child != null) {
        list.push(curNode.child.id);
        curNode = curNode.child;
      }
      return list;
    }

    getLength() {
      var curNode = this.root;
      var length = 0;
      while (curNode.child != null) {
        length++;
        curNode = curNode.child;
      }
      return length;
    }
  }

  class HistoryNode {
    constructor(artists, id /* Other vis info */) {
      this.id = id;
      this.artists = artists;
      this.child = null;
    }

    // Add a child to this node
    setChild(child) {
      this.child(child);
    }

    // Get the child at the given index
    getChild() {
      return child;
    }

    // Remove the given child
    // Does nothing if child is not a child of this node
    removeChild() {
      child = null;
    }
  }
</script> -->
<script>
  import { timelineStore } from "../stores.js";

  const nodeDistFromTop = 15;
  const nodeDist = 40;

  var timeline;

  timelineStore.subscribe((data) => {
    timeline = data;
  });

  // Initialize history
</script>

<div id="timeline">
  <h2>Timeline</h2>
  {#if timeline.length > 0}
    <svg
      id="timeline-svg"
      height="auto"
      width="100%"
      viewBox="0 0 100 {nodeDist * timeline.length}"
      preserveAspectRatio="xMinYMin meet"
    >
      {#each timeline as node, i}
        <g class="timeline-item" id="timeline-node-{node.id}">
          {#if i < timeline.length - 1}
            <line
              x1="50"
              x2="50"
              y1={nodeDistFromTop + nodeDist * i}
              y2={nodeDistFromTop + nodeDist * (i + 1)}
              style="stroke:rgb(0,0,0);stroke-width:1"
            />
          {/if}
          <circle
            cx="50"
            cy={nodeDistFromTop + nodeDist * i}
            r="10"
            fill="green"
            stroke="black"
            stroke-width="1"
          />
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
