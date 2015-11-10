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

};

Cell.prototype.neighbors = function () {

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
