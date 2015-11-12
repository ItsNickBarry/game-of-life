if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Game = window.GameOfLife.Game = function (options) {

  this._boardElement = options.boardElement     || document.createElement('div');
  this._counterElement = options.counterElement || document.createElement('div');
  this._resetElement = options.resetElement     || document.createElement('div');
  this._tickElement = options.tickElement       || document.createElement('div');
  this._toggleElement = options.toggleElement   || document.createElement('div');

  this._board = new GameOfLife.Board({
    el: options.boardElement,
    height: options.height,
    width: options.width,
    initialPopulationDensity: options.initialPopulationDensity,
    clickToToggle: options.clickToToggle
  });

  this._resetElement.addEventListener('click', this.handleClickReset.bind(this));
  this._toggleElement.addEventListener('click', this.handleClickToggle.bind(this));
  this._tickElement.addEventListener('click', this.handleClickTick.bind(this));

  this._tickInterval = options.tickInterval || Game.defaultValues.tickInterval;
  this._generation = 0;

  this.setStyle();
};

Game.defaultValues = {
  height: 30,
  width: 30,
  initialPopulationDensity: .3,
  tickInterval: 100,
  clickToToggle: true
};

Game.prototype.getBoardElement = function () {
  return this._boardElement;
};

Game.prototype.getCounterElement = function () {
  return this._counterElement;
};

Game.prototype.getResetElement = function () {
  return this._resetElement;
};

Game.prototype.getTickElement = function () {
  return this._tickElement;
};

Game.prototype.getToggleElement = function () {
  return this._toggleElement;
};

Game.prototype.handleClickReset = function (event) {
  this._counterElement.classList.remove('completed');
  if (this.isActive()) {
    this.stop();
  }
  this._board.initializeCells();
  this.updateCounter(0);
};

Game.prototype.handleClickTick = function (event) {
  if (!this.isActive()) {
    this.tick();
  }
};

Game.prototype.handleClickToggle = function (event) {
  this.toggle();
};

Game.prototype.isActive = function () {
  return typeof this._intervalId !== 'undefined';
};

Game.prototype.setCompleted = function () {
  this.stop();
  this._counterElement.classList.add('completed');
};

Game.prototype.setStyle = function () {
  var styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  [
    '.gol-board {' +
      'display: flex;' +
      'flex-flow: column nowrap;' +
    '}',

    '.gol-row {' +
      'display: flex;' +
      'flex-flow: row nowrap' +
    '}',

    '.gol-cell {' +
      'flex: auto;' +
    '}',

    '.gol-cell:before {' +
      'content: "";' +
      'display: block;' +
      'padding-top: 100%;' +
    '}'
  ].forEach(function (rule) {
    styleEl.sheet.insertRule(rule, 0);
  });
};

Game.prototype.start = function () {
  this._intervalId = setInterval(this.tick.bind(this), this._tickInterval);
  this._toggleElement.classList.add('active');
};

Game.prototype.stop = function () {
  clearInterval(this._intervalId);
  delete this._intervalId;
  this._toggleElement.classList.remove('active');
};

Game.prototype.tick = function () {
  this._board.tick();
  if (this._board.isStable()) {
    this.setCompleted();
  } else {
    this.updateCounter();
  }
};

Game.prototype.toggle = function () {
  this.isActive() ? this.stop() : this.start();
};

Game.prototype.updateCounter = function (n) {
  this._generation = typeof n === 'undefined' ? this._generation + 1 : n;
  this._counterElement.innerHTML = this._generation;
};
