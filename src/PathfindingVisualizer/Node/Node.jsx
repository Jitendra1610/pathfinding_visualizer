import React from "react";

import "./Node.css";

export default class Node extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  render() {
    const {
      isFinish,
      isStart,
      isWall,
      isWeight,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      row,
      col,
    } = this.props;

    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : isWeight
      ? "node-weight"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
