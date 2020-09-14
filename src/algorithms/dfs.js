export function dfs(grid, start, end) {
    const visitedOrder = [];
    dfsRecursive(grid, start, end, visitedOrder);
    return visitedOrder;
  }
  
  function dfsRecursive(grid, node, end, visitedOrder) {
    node.isVisited = true;
    visitedOrder.push(node);
    if (node === end) return true;
  
    const arr1 = [-1, 0, 1, 0];
    const arr2 = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      const x = node.row + arr1[i];
      const y = node.col + arr2[i];
      if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) continue;
      const neighbour = grid[x][y];
      if (neighbour.isVisited || neighbour.isWall) continue;
      neighbour.previousNode = node;
      if (dfsRecursive(grid, neighbour, end, visitedOrder)) return true;
    }
    return false;
  }
  