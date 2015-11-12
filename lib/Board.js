if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  this._el = options.el;
  this._height = options.height || 30;
  this._width = options.width || 30;
  this._initialPopulationDensity = options.initialPopulationDensity || 0;

  this._grid = [];
  this._activeCells = [];
  this._togglableCells = [];

  this.initializeCells();

  this.setStyle();
};

Board.prototype.getHeight = function () {
  return this._height;
};

Board.prototype.getWidth = function () {
  return this._width;
};

Board.prototype.setStyle = function () {
  var cellStyle = getComputedStyle(this.at(0, 0).getElement());
  var padding = cellStyle.getPropertyValue('padding-left');
  var margin = cellStyle.getPropertyValue('margin-left');
  var widthDifference = (parseInt(padding) + parseInt(margin)) * 2;

  var styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  var styleSheet = styleEl.sheet;

  var rules = [
    '.gol-row:after {' +
      'content: "";' +
      'display: block;' +
      'clear: both;' +
    '}',

    '.gol-cell {' +
      'width: calc(' + (100 / this._width) + '% - ' + widthDifference + 'px);' +
      'float: left;' +
    '}',

    '.gol-cell:before {' +
      'content: "";' +
      'display: block;' +
      'padding-top: 100%;' +
    '}'
  ]

  rules.forEach(function (rule) {
    styleSheet.insertRule(rule, 0);
  });
};

Board.prototype.initializeCells = function () {
  this._el.innerHTML = '';
  for (var y = 0; y < this._height; y++) {
    var row = document.createElement('div');
    row.classList.toggle('gol-row');
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

Board.prototype.at = function (x, y) {
  return this._grid[(y + this._height) % this._height][(x + this._width) % this._width];
};

Board.prototype.setCell = function (cell) {
  var row = cell.getY();
  var col = cell.getX();

  if (typeof this._grid[row] === 'undefined') {
    this._grid[row] = [];
  }

  this._grid[row][col] = cell;
};

Board.prototype.setActiveCell = function (cell) {
  var row = cell.getY();
  var col = cell.getX();

  if (typeof this._activeCells[row] === 'undefined') {
    this._activeCells[row] = [];
  }

  this._activeCells[row][col] = cell;
};

Board.prototype.setTogglableCell = function (cell) {
  var row = cell.getY();
  var col = cell.getX();

  if (typeof this._togglableCells[row] === 'undefined') {
    this._togglableCells[row] = [];
  }

  this._togglableCells[row][col] = cell;
}

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

Board.prototype.isStable = function () {
  return this._activeCells.length === 0;
};
