if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  var defaults = GameOfLife.Game.defaultValues;
  this._el = options.el;
  this._height = options.height || defaults.height;
  this._width = options.width || defaults.width;
  this._defaultPopulationDensity = options.defaultPopulationDensity ||
    defaults.defaultPopulationDensity;

  if (options.clickToToggle || (typeof options.clickToToggle === 'undefined' && defaults.clickToToggle)) {
    this._el.addEventListener('click', this.handleClickBoard.bind(this));
  }

  this._grid = [];
  this._activeCells = [];
  this._togglableCells = [];

  this.initializeCells();
};

Board.prototype.at = function (x, y) {
  return this._grid[(y + this._height) % this._height][(x + this._width) % this._width];
};

Board.prototype.atZIndex = function (z) {
  var x = this._width - 1 - z % this._width;
  var y = (z - z % this._width) / this._width;
  return this.at(x, y);
};

Board.prototype.clear = function () {
  this.initializeCells(0);
};

Board.prototype.getHeight = function () {
  return this._height;
};

Board.prototype.getWidth = function () {
  return this._width;
};

Board.prototype.handleClickBoard = function (event) {
  if (event.target.classList.contains('gol-cell')) {
    var z = event.target.style['z-index'];
    this.atZIndex(z).toggle();
  }
};

Board.prototype.isStable = function () {
  return this._activeCells.length === 0;
};

Board.prototype.initializeCells = function (density) {
  var spawnChance = typeof density === 'undefined' ? this._defaultPopulationDensity : density;
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
        isLive: (Math.random() < spawnChance)
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
