if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Cell = window.GameOfLife.Cell = function (options) {
  this.x = options.x;
  this.y = options.y;
  this.board = options.board;

  this.isLive = options.isLive;
  this.el = document.createElement('div');
  this.el.className = 'gol-cell' + (this.isLive ? ' live' : '');

  this.calculateZIndex();
};

Cell.prototype.liveNeighborCount = function () {
  var liveNeighbors = [];
  this.neighbors().forEach(function (neighbor) {
    if (neighbor.isLive) {
      liveNeighbors.push(neighbor);
    }
  });
  return liveNeighbors.length;
};

Cell.prototype.neighbors = function () {
  if (typeof this._neighbors === 'undefined') {
    this._neighbors = [];
    [
      [ 0, -1],
      [ 1, -1],
      [ 1,  0],
      [ 1,  1],
      [ 0,  1],
      [-1,  1],
      [-1,  0],
      [-1, -1],
    ].forEach(function (offset) {
      this._neighbors.push(this.board.at(this.x + offset[0], this.y + offset[1]));
    }.bind(this));
  }
  return this._neighbors;
};

Cell.prototype.calculateZIndex = function () {
  this.el.style['z-index'] = this.board.width - 1 - this.x + (this.board.width * this.y);
};

Cell.prototype.toggle = function () {
  this.isLive ^= true;
  this.el.classList.toggle('live');

  this.neighbors().concat([this]).forEach(function (cell) {
    this.board.setActiveCell(cell);
  }.bind(this));
};

Cell.prototype.challenge = function () {
  var liveNeighborCount = this.liveNeighborCount();
  if ((this.isLive && (liveNeighborCount < 2 || liveNeighborCount > 3)) || (!this.isLive && liveNeighborCount === 3)) {
    this.board.setTogglableCell(this);
  }
};
