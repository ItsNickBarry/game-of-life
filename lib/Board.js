if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  var defaults = GameOfLife.Game.defaultValues;
  this._el = options.el;
  this._height = options.height || defaults.height;
  this._width = options.width || defaults.width;
  this._initialPopulationDensity = options.initialPopulationDensity ||
    defaults.initialPopulationDensity;

  this._grid = [];
  this._activeCells = [];
  this._togglableCells = [];

  this.initializeCells();
};

Board.prototype.at = function (x, y) {
  return this._grid[(y + this._height) % this._height][(x + this._width) % this._width];
};

Board.prototype.getHeight = function () {
  return this._height;
};

Board.prototype.getWidth = function () {
  return this._width;
};

Board.prototype.isStable = function () {
  return this._activeCells.length === 0;
};

Board.prototype.initializeCells = function () {
  while (this._el.firstChild) {
    this._el.removeChild(this._el.firstChild);
  }
  for (var y = 0; y < this._height; y++) {
    var row = document.createElement('div');
    row.classList.add('gol-row');
    this._el.appendChild(row);
    for (var x = 0; x < this._width; x++) {
      var cell = new GameOfLife.Cell({
        x: x,
        y: y,
        board: this,
        isLive: (Math.random() < this._initialPopulationDensity)
      });

      row.appendChild(cell.getElement());
      this.setCell(cell);
      this.setActiveCell(cell);
    }
  }
};

Board.prototype.setCell = function (cell) {
  this.trackCell(cell, this._grid);
};

Board.prototype.setActiveCell = function (cell) {
  this.trackCell(cell, this._activeCells);
};

Board.prototype.setTogglableCell = function (cell) {
  this.trackCell(cell, this._togglableCells);
}

Board.prototype.trackCell = function (cell, grid) {
  var row = cell.getY();
  var col = cell.getX();

  if (typeof grid[row] === 'undefined') {
    grid[row] = [];
  }

  grid[row][col] = cell;
};

Board.prototype.tick = function () {
  this._activeCells.forEach(function (row) {
    row.forEach(function (cell) {
      cell.challenge();
    });
  });

  this._activeCells = [];

  this._togglableCells.forEach(function (row) {
    row.forEach(function (cell) {
      cell.toggle();
    });
  });

  this._togglableCells = [];
};
