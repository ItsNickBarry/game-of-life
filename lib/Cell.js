if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Cell = window.GameOfLife.Cell = function (x, y, board, isLive) {
  this.x = x;
  this.y = y;
  this.board = board;
  this.isLive = isLive;
  this.el = document.createElement('div');
  this.el.className = 'cell' + (this.isLive ? ' live' : '');
  this.appendToGame();
};
Cell.prototype.appendToGame = function () {
  this.board.el.appendChild(this.el);
};

Cell.prototype.liveNeighbors = function () {
  var liveNeighbors = [];
  this.neighbors().forEach(function (neighbor) {
    if (neighbor.isLive) {
      liveNeighbors.push(neighbor);
    }
  });
  return liveNeighbors;
};

Cell.prototype.neighbors = function () {
  var neighbors = [];
  [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ].forEach(function (offset) {
    neighbors.push(this.board.at(this.x + offset[0], this.y + offset[1]));
  }.bind(this));
  return neighbors;
};

Cell.prototype.setZIndex = function (zIndex) {
  this.el.style['z-index'] = zIndex;
};

Cell.prototype.toggle = function () {
  this.isLive ^= true;
  this.el.classList.toggle('live');
};

Cell.prototype.challenge = function () {
  // if (this.neighbors.length
};
