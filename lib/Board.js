if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  this.el = options.el;
  this.height = options.height || 30;
  this.width = options.width || 30;
  this.initializeCells(options.startLiveChance || 0);
  this.el.style.width = '' + ((22 + 2) * 30) + 'px';
};

Board.prototype.initializeCells = function (startLiveChance) {
  this.grid = [];
  for (var y = 0; y < this.height; y++) {
    this.grid.push([]);
    for (var x = 0; x < this.width; x++) {
      var isLive = Math.random() < startLiveChance;
      var cell = new GameOfLife.Cell(x, y, this, isLive);
      cell.setZIndex(this.width -1 - x + (this.width * y));
      this.grid[y].push(cell);
    }
  }
};

Board.prototype.at = function (x, y) {
  return this.grid[(y + this.height) % this.height][(x + this.width) % this.width];
};

Board.prototype.step = function () {
  console.log('step');
};

Board.prototype.isStable = function () {
  // TODO return true if board has not changed
  return false;
};
