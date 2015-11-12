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
    initialPopulationDensity: options.initialPopulationDensity
  });

  this._resetElement.addEventListener('click', this.onClickReset.bind(this));
  this._toggleElement.addEventListener('click', this.onClickToggle.bind(this));
  this._tickElement.addEventListener('click', this.onClickTick.bind(this));

  this._counterElement = options.counterElement;
  this._generation = 0;
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

Game.prototype.isActive = function () {
  return typeof this._intervalId !== 'undefined';
};

Game.prototype.onClickReset = function (event) {
  this._counterElement.classList.remove('completed');
  if (this.isActive()) {
    this.stop();
  }
  this._board.initializeCells();
  this._generation = 0;
  this.updateCounter();
};

Game.prototype.onClickTick = function (event) {
  if (!this.isActive()) {
    this.tick();
  }
};

Game.prototype.onClickToggle = function (event) {
  this.toggle();
};

Game.prototype.setCompleted = function () {
  this.stop();
  if (typeof this._counterElement !== 'undefined') {
    this._counterElement.classList.add('completed');
  }
}

Game.prototype.start = function () {
  this._intervalId = setInterval(this.tick.bind(this), 100);
  this._toggleElement.classList.add('active');
};

Game.prototype.stop = function () {
  clearInterval(this._intervalId);
  this._intervalId = undefined;
  this._toggleElement.classList.remove('active');
};

Game.prototype.tick = function () {
  this._board.tick();

  if (this._board.isStable()) {
    this.setCompleted();
  } else {
    this._generation++;
    this.updateCounter();
  }
};

Game.prototype.toggle = function () {
  if (this.isActive()) {
    this.stop();
  } else {
    this.start();
  }
};

Game.prototype.updateCounter = function () {
  if (typeof this._counterElement !== 'undefined') {
    this._counterElement.innerHTML = this._generation;
  }
};
