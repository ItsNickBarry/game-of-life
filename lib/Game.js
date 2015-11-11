if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Game = window.GameOfLife.Game = function (options) {
  if (typeof options.boardEl === 'undefined') {
    throw "Game must be passed an element to occupy"
  }

  var mustAutoStart = !options.toggleEl;

  this._counterEl = options.counterEl || document.createElement('div');
  this._tickEl = options.tickEl       || document.createElement('div');
  this._toggleEl = options.toggleEl   || document.createElement('div');
  this._resetEl = options.resetEl     || document.createElement('div');

  this._board = new GameOfLife.Board({
    el: options.boardEl,
    height: options.height,
    width: options.width,
    startLiveChance: options.startLiveChance
  });

  this._resetEl.addEventListener('click', this.onClickReset.bind(this));
  this._toggleEl.addEventListener('click', this.onClickToggle.bind(this));
  this._tickEl.addEventListener('click', this.onClickTick.bind(this));

  this._counterEl = options.counterEl;
  this._generation = 0;

  if (mustAutoStart) {
    this.start();
  }
};

Game.prototype.isActive = function () {
  return typeof this._intervalId !== 'undefined';
};

Game.prototype.onClickReset = function (event) {
  this._counterEl.classList.remove('completed');
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
  if (typeof this._counterEl !== 'undefined') {
    this._counterEl.classList.add('completed');
  }
}

Game.prototype.start = function () {
  this._intervalId = setInterval(this.tick.bind(this), 100);
  this._toggleEl.innerHTML = '<span><i class="fa fa-pause"></i></span>';
};

Game.prototype.stop = function () {
  clearInterval(this._intervalId);
  this._intervalId = undefined;
  this._toggleEl.innerHTML = '<span><i class="fa fa-play"></i></span>';
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
  if (typeof this._counterEl !== 'undefined') {
    this._counterEl.innerHTML = this._generation;
  }
};
