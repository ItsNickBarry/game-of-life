if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Game = window.GameOfLife.Game = function (options) {
  if (typeof options.boardEl === 'undefined') {
    throw "Game must be passed an element to occupy"
  }

  this.board = new GameOfLife.Board({
    el: options.boardEl,
    height: options.height,
    width: options.width,
    startLiveChance: options.startLiveChance
  });

  if (typeof options.toggleEl === 'undefined') {
    this.toggle();
  } else {
    this.toggleEl = options.toggleEl;
    this.toggleEl.addEventListener('click', function (event) {
      this.toggle();
    }.bind(this));
  }

  if (typeof options.resetEl !== 'undefined') {
    this.resetEl = options.resetEl;
    this.resetEl.addEventListener('click', function (event) {
      if (this.isActive()) {
        this.stop();
      }
      this.board.initializeCells();
      this.generation = 0;
      this.updateCounter();
    }.bind(this));
  }

  if (typeof options.tickEl !== 'undefined') {
    this.tickEl = options.tickEl;
    this.tickEl.addEventListener('click', function (event) {
      if (!this.isActive()) {
        this.tick();
      }
    }.bind(this));
  }

  this.counterEl = options.counterEl;
  this.generation = 0;
};

Game.prototype.isActive = function () {
  return typeof this.intervalId !== 'undefined';
};

Game.prototype.toggle = function () {
  if (this.isActive()) {
    this.stop();
  } else {
    this.start();
  }
};

Game.prototype.start = function () {
  this.intervalId = setInterval(this.tick.bind(this), 100);
  this.toggleEl.innerHTML = 'Stop';
};

Game.prototype.stop = function () {
  clearInterval(this.intervalId);
  this.intervalId = undefined;
  this.toggleEl.innerHTML = 'Start';
};

Game.prototype.tick = function () {
  this.board.tick();

  if (this.board.isStable()) {
    this.toggle();
    return;
  }

  this.generation++;
  this.updateCounter();
};

Game.prototype.updateCounter = function () {
  if (typeof this.counterEl !== 'undefined') {
    this.counterEl.innerHTML = this.generation;
  }
};
