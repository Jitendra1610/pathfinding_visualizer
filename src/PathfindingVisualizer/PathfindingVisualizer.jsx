import React from "react";
import Node from "./Node/Node";
import { bfs, getNodesInShortestPathOrder } from "../algorithms/bfs";
import "./PathfindingVisualizer.css";
import { dfs } from "../algorithms/dfs";
import { djikstra } from "../algorithms/djikstra";
import { dfsMaze } from "../MazeAlgorithms/dfsMaze";
import { recursiveDivision } from "../MazeAlgorithms/recursiveDivision";

var HEIGHT = 20;
var WIDTH = 50;
var START_ROW = 10;
var START_COL = 15;
var FINISH_ROW = 5;
var FINISH_COL = 35;
var stopAnimating = false;
//var pause = false;

const getRandomInteger = (min, max) => {
  max = max + 1;
  return Math.floor(Math.random() * (max - min)) + min;
};

export default class PathfindingVisualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isMousePressed: false,
      isPickStart: false,
      isPickEnd: false,
      isBfs: false,
      isDfs: false,
      isWeight: false,
      isPlaceWeight: false,
      isDjikstra: false,
      isAnimating: false,
      isDfsMaze: false,
      recursiveDivision: false,
      isMazeAnimating: false,
    };
  }

  state1 = {
    background: "green",
  };
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  pickStart() {
    this.setState({ isPickStart: true });
  }

  pickEnd() {
    this.setState({ isPickEnd: true });
  }

  handleMouseDown(row, col) {
    if (this.state.isAnimating === true || this.state.isMazeAnimating === true)
      return;
    if (row === START_ROW && col === START_COL) {
      const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
      this.setState({
        isMousePressed: true,
        isPickStart: true,
      });
      return;
    }
    if (row === FINISH_ROW && col === FINISH_COL) {
      const newGrid = getNewGridWithEndToggled(this.state.grid, row, col);
      this.setState({
        isMousePressed: true,
        isPickEnd: true,
      });
      return;
    }
    if (this.state.isPlaceWeight) {
      const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
        isMousePressed: true,
      });
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({
      grid: newGrid,
      isMousePressed: true,
    });
  }

  handleMouseUp() {
    if (this.state.isAnimating || this.state.isMazeAnimating) return;
    if (this.state.isPickStart) {
      this.setState({
        isPickStart: false,
      });
    }
    if (this.state.isPickEnd) {
      this.setState({
        isPickEnd: false,
      });
    }
    this.setState({
      isMousePressed: false,
    });
  }

  handleMouseEnter(row, col) {
    if (this.state.isPickStart) {
      START_ROW = row;
      START_COL = col;
      // const newGrid = getNewGridWithStartToggled1(this.state.grid, row, col);
      // this.setState({
      //   grid: newGrid,
      // });
      return;
    }
    if (this.state.isPickEnd) {
      FINISH_COL = col;
      FINISH_ROW = row;
      return;
    }
    if (!this.state.isMousePressed) return;
    if (this.state.isPlaceWeight) {
      const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
      });
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({
      grid: newGrid,
    });
  }

  handleWeight() {
    this.setState({
      isPlaceWeight: !this.state.isPlaceWeight,
    });
  }
  refreshBoardForPathfinding(currGrid) {
    // Defaults visited & distance of each node. Need this before
    // running the pathfinding algorithms
    const grid = currGrid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
      }
    }
    return grid;
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const firstNodeInShortestPath = nodesInShortestPathOrder[0];
    if (
      !(
        firstNodeInShortestPath.row === START_ROW &&
        firstNodeInShortestPath.col === START_COL
      )
    ) {
      alert("No Shortest Path");
      return;
    }
    const node = nodesInShortestPathOrder[0];
    document.getElementById(`node-${node.row}-${node.col}`).className =
      "node node-shortest-path node-start";

    let i = 1;
    function animate() {
      if (stopAnimating) {
        //clearBoard();
        return;
      }
      const node = nodesInShortestPathOrder[i];
      if (i === nodesInShortestPathOrder.length - 1) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path node-finish";
        return;
      } else {
        if (node.isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weight node-shortest-path";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
        // document.getElementById(`node-${node.row}-${node.col}`).className =
        //   "node ";
      }
      i++;

      requestAnimationFrame(animate);
    }
    animate();
  }

  animateVisitedNodes(
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    startNode,
    finishNode
  ) {
    let i = 1;
    let animatingShortestPath = this.animateShortestPath;
    //let enableExceptClearboard = this.enableExceptClearboard;
    this.setState({
      isAnimating: true,
    });
    function animate() {
      if (stopAnimating) {
        //enableExceptClearboard();
        return;
      }
      if (i === visitedNodesInOrder.length - 1) {
        console.log("animating shortest path");
        //animatingShortestPath(nodesInShortestPathOrder, enableExceptClearboard);
        animatingShortestPath(nodesInShortestPathOrder);
        //document.getElementById("clear").disabled = false;
        return;
      }
      const node = visitedNodesInOrder[i];
      const { row, col } = node;
      if (
        !(row === START_ROW && col === START_COL) ||
        (row === FINISH_ROW && col === FINISH_COL)
      ) {
        if (node.isWeight) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-weight node-visited";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }
      i++;
      requestAnimationFrame(animate);
    }
    animate();
  }

  visualizeBFS() {
    if (this.state.isBfs || this.state.isDfs || this.state.isDjikstra) {
      return;
    } else {
      stopAnimating = false;
      this.setState({
        isBfs: true,
      });
    }
    let { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    //grid = this.refreshBoardForPathfinding(grid);
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  visualizeDFS() {
    if (this.state.isBfs || this.state.isDfs || this.state.isDjikstra) {
      return;
    }
    // if (START_ROW == -1 || START_COL == -1) {
    //   alert("start node isn't selected");
    //   return;
    // }
    // if (FINISH_NODE_ROW == -1 || FINISH_NODE_COL == -1) {
    //   alert("end node isn't selected");
    // }
    // document.getElementsByClassName("info")[0].innerHTML =
    //   "Breadth First Search Algorithm is <strong>unweighted</strong> algorithm and <strong>guarentees</strong> shortest path";
    // this.disableExceptClearboard();
    this.setState({
      isDfs: true,
    });
    stopAnimating = false;
    let { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    //grid = this.refreshBoardForPathfinding(grid);
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }

  visualizeDJIKSTRA() {
    if (this.state.isBfs || this.state.isDfs || this.state.isDjikstra) {
      return;
    } else {
      stopAnimating = false;
      this.setState({
        isDjikstra: true,
      });
    }

    let { grid } = this.state;
    const startNode = grid[START_ROW][START_COL];
    const finishNode = grid[FINISH_ROW][FINISH_COL];
    grid = this.refreshBoardForPathfinding(grid);
    const visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateVisitedNodes(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      startNode,
      finishNode
    );
  }
  clearBoard() {
    START_ROW = 10;
    START_COL = 15;
    FINISH_ROW = 5;
    FINISH_COL = 35;
    stopAnimating = true;
    const newGrid = getInitialGrid();
    for (let row = 0; row < newGrid.length; ++row) {
      for (let col = 0; col < newGrid[0].length; ++col) {
        if (row === 10 && col === 15) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-start";
          continue;
        } else if (row === FINISH_ROW && col === FINISH_COL) {
          document.getElementById(`node-${row}-${col}`).className =
            "node node-finish";
          continue;
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node";
        }
      }
    }
    this.setState({
      grid: newGrid,
      isBfs: false,
      isDfs: false,
      isDjikstra: false,
      isWall: false,
      isWeight: false,
      isPlaceWeight: false,
      isMousePressed: false,
      isAnimating: false,
      isMazeAnimating: false,
    });
  }

  refreshBoardForMaze(currGrid) {
    let grid = currGrid.slice();
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.isWall = false;
      }
    }
    return grid;
  }

  visualizeDFSMaze() {
    //21*51 board
    stopAnimating = false;
    let { grid } = this.state;
    grid = this.refreshBoardForMaze(grid);
    let start_x = getRandomInteger(0, HEIGHT);
    let start_y = getRandomInteger(0, WIDTH);
    while (start_x % 2 != 0) {
      start_x = getRandomInteger(0, HEIGHT);
    }
    while (start_y % 2 != 0) {
      start_y = getRandomInteger(0, WIDTH);
    }
    const visitedNodesInOrder = dfsMaze(grid, start_x, start_y);
    this.animateMaze(visitedNodesInOrder);
  }

  visualizeRecursiveDivision() {
    stopAnimating = false;
    let { grid } = this.state;
    grid = this.refreshBoardForMaze(grid);
    const visitedNodesInOrder = recursiveDivision(grid);
    this.animateMaze(visitedNodesInOrder);
  }

  animateMaze(visitedNodesInOrder) {
    let i = 1;
    //let enableExceptClearboard = this.enableExceptClearboard;

    function animate() {
      if (stopAnimating) {
        //enableExceptClearboard();
        return;
      }
      if (i === visitedNodesInOrder.length - 1) {
        return;
      }
      const node = visitedNodesInOrder[i];
      if (
        node.row !== START_ROW &&
        node.col !== START_COL &&
        node.col !== FINISH_COL &&
        node.row !== FINISH_ROW
      )
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall";
      i++;
      requestAnimationFrame(animate);
    }
    animate();
  }

  render() {
    const { grid, isMousePressed } = this.state;
    return (
      <>
        <nav
          class="navbar navbar-expand-sm fixed-top navbar-dark bg-dark"
          id="myNavbar"
        >
          <a class="navbar-brand" href="#" id="logo">
            Pathfinding Visualizer
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item dropdown" id="mazes">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Mazes
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      this.state.isDfsMaze = true;
                      this.visualizeDFSMaze();
                    }}
                  >
                    Dfs Maze
                  </a>
                  <a
                    class="dropdown-item"
                    href="#"
                    onClick={() => {
                      this.state.recursiveDivision = true;
                      this.visualizeRecursiveDivision();
                    }}
                  >
                    Recursive Division
                  </a>
                  {/* <a class="dropdown-item" href="#">
                    Recursive Division (Vertical Skew)
                  </a>
                  <a class="dropdown-item" href="#">
                    Recursive Division (Horizontal Skew)
                  </a>
                  <a class="dropdown-item" href="#">
                    Simple Spiral
                  </a> */}
                </div>
              </li>
              .
            </ul>
            <div className="weight">
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  this.handleWeight();
                }}
              >
                Weight
              </button>
            </div>
            <div className="app">
              <button
                type="button"
                class="btn btn-success"
                onClick={() => {
                  this.visualizeBFS();
                }}
              >
                Visualize BFS
              </button>
            </div>
            <div className="app1">
              <button
                type="button"
                class="btn btn-success"
                onClick={() => {
                  this.visualizeDFS();
                }}
              >
                Visualize DFS
              </button>
            </div>
            <div className="app2">
              <button
                type="button"
                class="btn btn-success"
                onClick={() => {
                  this.visualizeDJIKSTRA();
                }}
              >
                Visualize DJIKSTRA
              </button>
            </div>
            <button
              type="button"
              class="btn btn-danger"
              onClick={() => {
                this.clearBoard();
              }}
            >
              Clear
            </button>
          </div>
        </nav>
        <div className="row" style={{ paddingTop: "60px" }}>
          <div className="col-sm-2">
            <div className="app4"></div>
            <h3>Start </h3>
          </div>
          <div className="col-sm-2">
            <div className="app5"></div>
            <h3>End </h3>
          </div>
          <div className="col-sm-2">
            <div className="app6"></div>
            <h3>Visited </h3>
          </div>
          <div className="col-sm-2">
            <div className="app7"></div>
            <h3>Unvisited </h3>
          </div>
          <div className="col-sm-2">
            <div className="app8"></div>
            <h3>Shortest-Path </h3>
          </div>
          <div className="col-sm-2">
            <div className="app9"></div>
            <h3>Wall </h3>
          </div>
        </div>
        <div className="grid main">
          {grid.map((row, rowIndex) => {
            return (
              <div key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    isWeight,
                  } = node;
                  return (
                    <Node
                      key={nodeIndex}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
                      isMousePressed={isMousePressed}
                      onMouseDown={(row, col) => {
                        this.handleMouseDown(row, col);
                      }}
                      onMouseEnter={(row, col) => {
                        this.handleMouseEnter(row, col);
                      }}
                      onMouseUp={() => {
                        this.handleMouseUp();
                      }}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row <= HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col <= WIDTH; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 10 && col === 15,
    isFinish: row === 5 && col === 35,
    isVisited: false,
    isWall: false,
    isWeight: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isWall=True which makes its className='node-wall' whose color is black as specified in the styling
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isWall=True which makes its className='node-wall' whose color is black as specified in the styling
  const newNode = {
    ...node,
    isWeight: !node.isWeight,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isStart=True which makes its className='node-start' whose color is specified in the styling
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithEndToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  // This node has isEnd=True which makes its className='node-end' whose color is specified in the styling
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
