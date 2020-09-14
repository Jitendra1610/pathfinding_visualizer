class Queue {
    constructor() {
      this.arr = [];
    }
  
    enqueue(x) {
      this.arr.push(x);
    }
  
    isEmpty() {
      if (this.arr.length == 0) return true;
      return false;
    }
  
    // printQueue(){
    //     let str = "";
    //     for(let i=0;i<this.arr.length;i++){
    //         str+=this.arr[i]+" ";
    //     }
    //     return str;
    // }
  
    dequeue() {
      if (this.isEmpty()) return "Empty queue";
      return this.arr.shift();
    }
  
    front() {
      if (this.isEmpty()) {
        return "Empty queue";
      }
      return this.arr[0];
    }
  }
  
  export function bfs(grid, start, end) {
    const visitedOrder = [];
    let q = new Queue();
    q.enqueue(start);
    visitedOrder.push(start);
    start.isVisited = true;
    const arr1 = [1, -1, 0, 0];
    const arr2 = [0, 0, 1, -1];
    while (!q.isEmpty()) {
      let temp = q.front();
      q.dequeue();
      if (temp === end) break;
      for (let i = 0; i < 4; i++) {
        let row = temp.row + arr1[i];
        let col = temp.col + arr2[i];
        if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length)
          continue;
  
        const neighbour = grid[row][col];
        if (neighbour.isVisited || neighbour.isWall) continue;
  
        neighbour.isVisited = true;
        q.enqueue(neighbour);
        visitedOrder.push(neighbour);
        neighbour.previousNode = temp;
      }
    }
    return visitedOrder;
  }
  
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode != null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  