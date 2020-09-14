class QElement {
    constructor(element, priority) {
      this.element = element;
      this.priority = priority;
    }
  }
  class PriorityQueue {
    constructor() {
      this.arr = [];
    }
  
    enqueue(element, priority) {
      var qElement = new QElement(element, priority);
      let flag = false;
  
      for (var i = 0; i < this.arr.length; i++) {
        if (this.arr[i].priority > qElement.priority) {
          flag = true;
          this.arr.splice(i, 0, qElement);
          break;
        }
      }
  
      if (!flag) {
        this.arr.push(qElement);
      }
    }
  
    isEmpty() {
      if (this.arr.length === 0) return true;
      return false;
    }
  
    dequeue() {
      if (this.isEmpty()) return "Underflow";
      return this.arr.shift();
    }
  
    front() {
      if (this.isEmpty()) return "No Elements in Queue";
      return this.arr[0];
    }
  
    rear() {
      if (this.isEmpty()) return "No elements in Queue";
      return this.arr[this.arr.length - 1];
    }
  }
  
  export function djikstra(grid, start, end) {
    //let prev = [];
    const nodes = getAllNodes(grid);
    // nodes.forEach((node) => {
    //   prev[node] = null;
    // });
    let pq = new PriorityQueue();
  
    start.distance = 0;
    pq.enqueue(start, 0);
    const visitedOrder = [];
    while (!pq.isEmpty()) {
      let temp = pq.dequeue();
  
      let value = temp.element;
      let weight = temp.priority;
  
      if (value.distance === Infinity) break;
  
      visitedOrder.push(value);
      value.isVisited = true;
  
      if (value === end) break;
  
      const arr1 = [1, 0, -1, 0];
      const arr2 = [0, 1, 0, -1];
  
      for (let i = 0; i < 4; i++) {
        let row = value.row + arr1[i];
        let col = value.col + arr2[i];
  
        if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length)
          continue;
  
        const neighbor = grid[row][col];
        if (neighbor.isVisited === true || neighbor.isWall === true) continue;
  
        if (value.distance + 1 < neighbor.distance) {
          let edgeWeight = 1;
          if (neighbor.isWeight) edgeWeight = edgeWeight * 10;
          neighbor.distance = value.distance + edgeWeight;
          neighbor.previousNode = value;
          //prev[neighbor] = value;
          pq.enqueue(neighbor, neighbor.distance);
        }
      }
    }
    return visitedOrder;
  }
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  