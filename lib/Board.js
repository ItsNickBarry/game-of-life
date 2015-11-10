if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Board = window.GameOfLife.Board = function (options) {
  this.el = options.el;
  this.height = options.height || 30;
  this.width = options.width || 30;
  this.startLiveChance = options.startLiveChance || 0;

  this.grid = [];
  this.activeCells = [];
  this.togglableCells = [];

  this.initializeCells();

  this.setStyle();
};

Board.prototype.setStyle = function () {
  var cellStyle = getComputedStyle(this.at(0, 0).el);
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
      'width: calc(' + (100 / this.width) + '% - ' + widthDifference + 'px);' +
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
  this.el.innerHTML = '';
  for (var y = 0; y < this.height; y++) {
    var row = document.createElement('div');
    row.classList.toggle('gol-row');
    this.el.appendChild(row);
    for (var x = 0; x < this.width; x++) {
      var isLive = Math.random() < this.startLiveChance;
      var cell = new GameOfLife.Cell(x, y, this, isLive);
      cell.setZIndex(this.width -1 - x + (this.width * y));
      row.appendChild(cell.el);
      this.setCell(cell);
      this.setActiveCell(cell);
    }
  }
};

Board.prototype.at = function (x, y) {
  return this.grid[(y + this.height) % this.height][(x + this.width) % this.width];
};

Board.prototype.setCell = function (cell) {
  var row = cell.y;
  var col = cell.x;

  if (typeof this.grid[row] === 'undefined') {
    this.grid[row] = [];
  }

  this.grid[row][col] = cell;
};

Board.prototype.setActiveCell = function (cell) {
  var row = cell.y;
  var col = cell.x;

  if (typeof this.activeCells[row] === 'undefined') {
    this.activeCells[row] = [];
  }

  this.activeCells[row][col] = cell;
};

Board.prototype.setTogglableCell = function (cell) {
  var row = cell.y;
  var col = cell.x;

  if (typeof this.togglableCells[row] === 'undefined') {
    this.togglableCells[row] = [];
  }

  this.togglableCells[row][col] = cell;
}

Board.prototype.tick = function () {
  this.activeCells.forEach(function (row) {
    row.forEach(function (cell) {
      cell.challenge();
    });
  });

  this.activeCells = [];

  this.togglableCells.forEach(function (row) {
    row.forEach(function (cell) {
      cell.toggle();
    });
  });

  this.togglableCells = [];
};

Board.prototype.isStable = function () {
  return this.activeCells.length === 0;
};
