if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Cell = window.GameOfLife.Cell = function (options) {
  this._x = options.x;
  this._y = options.y;
  this._board = options.board;

  this._isLive = options.isLive;
  this._el = document.createElement('div');
  this._el.className = (this.isLive() ? 'gol-cell live' : 'gol-cell');

  this.calculateZIndex();
};

Cell.prototype.getElement = function () {
  return this._el;
};

Cell.prototype.getX = function () {
  return this._x;
};

Cell.prototype.getY = function () {
  return this._y;
};

Cell.prototype.isLive = function () {
  return this._isLive;
};

Cell.prototype.calculateZIndex = function () {
  this._el.style['z-index'] = this._board.getWidth() - 1 - this._x + (this._board.getWidth() * this._y);
};

Cell.prototype.challenge = function () {
  var liveNeighborCount = this.liveNeighborCount();
  if ((this.isLive() && (liveNeighborCount < 2 || liveNeighborCount > 3)) || (!this.isLive() && liveNeighborCount === 3)) {
    this._board.setTogglableCell(this);
  }
};

Cell.prototype.liveNeighborCount = function () {
  var liveNeighbors = [];
  this.neighbors().forEach(function (neighbor) {
    if (neighbor.isLive()) {
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
      this._neighbors.push(this._board.at(this._x + offset[0], this._y + offset[1]));
    }.bind(this));
  }
  return this._neighbors;
};

Cell.prototype.toggle = function () {
  this._isLive ^= true;
  this._el.classList.toggle('live');

  this.neighbors().concat([this]).forEach(function (cell) {
    this._board.setActiveCell(cell);
  }.bind(this));
};
