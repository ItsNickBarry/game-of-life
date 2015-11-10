if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  this.el = options.el;
  this.height = options.height || 30;
  this.width = options.width || 30;
  this.startLiveChance = options.startLiveChance || 0;

  this.activeCells = [];
  this.willToggle = [];

  this.initializeCells();

  this.setStyle();
};

Board.prototype.initializeCells = function () {
  this.el.innerHTML = '';
  this.grid = [];
  for (var y = 0; y < this.height; y++) {
    this.grid.push([]);
    for (var x = 0; x < this.width; x++) {
      var isLive = Math.random() < this.startLiveChance;
      var cell = new GameOfLife.Cell(x, y, this, isLive);
      cell.setZIndex(this.width -1 - x + (this.width * y));
      this.grid[y].push(cell);
      this.setActiveCell(cell);
    }
  }
};

Board.prototype.setStyle = function () {
  var cellStyle = getComputedStyle(this.at(0, 0).el);
  var cellSize = cellStyle.getPropertyValue('width');
  var cellMargin = cellStyle.getPropertyValue('margin-left');
  this.el.style.width = '' + ((parseInt(cellSize) + parseInt(cellMargin) * 2) * this.width) + 'px';
};

Board.prototype.at = function (x, y) {
  return this.grid[(y + this.height) % this.height][(x + this.width) % this.width];
};

Board.prototype.setActiveCell = function (cell) {
  var row = cell.y;
  var col = cell.x;

  if (typeof this.activeCells[row] === 'undefined') {
    this.activeCells[row] = [];
  }

  this.activeCells[row][col] = cell;
};

Board.prototype.setWillToggle = function (cell) {
  var row = cell.y;
  var col = cell.x;

  if (typeof this.willToggle[row] === 'undefined') {
    this.willToggle[row] = [];
  }

  this.willToggle[row][col] = cell;
}

Board.prototype.tick = function () {
  this.activeCells.forEach(function (row) {
    row.forEach(function (cell) {
      cell.challenge();
    });
  });

  this.activeCells = [];

  this.willToggle.forEach(function (row) {
    row.forEach(function (cell) {
      cell.toggle();
    });
  });

  this.willToggle = [];
};

Board.prototype.isStable = function () {
  return this.activeCells.length === 0;
};
