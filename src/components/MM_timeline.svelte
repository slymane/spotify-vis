<script context="module">
  // Head for history tree
  // History is structured as a tree to allow for multiple "timelines"

  export class History {
    constructor() {
      this.root = null;
      this.curHistoryNode = null;
    }

    // Add a new node to the history tree
    addNode(artists, id) {
      var curNode = this.root;
      while (curNode.child != null) {
        curNode = curNode.child;
      }
      curNode.child = new HistoryNode(artists, id);
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

  export let history = new History();
</script>

<script>
</script>

<div id="timeline">
  <p>Timeline</p>
  <!-- TODO: For each timeline, instantiate a div -->
</div>

<style>
  #timeline {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
