if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Game = window.GameOfLife.Game = function (options) {
  if (typeof options.boardEl === 'undefined') {
    throw "Game must be passed an element to occupy"
  }

  if (typeof options.toggleEl === 'undefined') {
    this.toggle();
  } else {
    this.toggleEl = options.toggleEl;
    this.toggleEl.addEventListener('click', function (event) {
      this.toggle();
    }.bind(this));
  }

  this.board = new GameOfLife.Board({
    el: options.boardEl,
    height: options.height,
    width: options.width,
    startLiveChance: .3
  });

  if (typeof options.resetEl !== 'undefined') {
    this.resetEl = options.resetEl;
    this.resetEl.addEventListener('click', function (event) {
      this.board.initializeCells();
    }.bind(this));
  }

  if (typeof options.tickEl !== 'undefined') {
    this.tickEl = options.tickEl;
    this.tickEl.addEventListener('click', function (event) {
      if (typeof this.intervalID === 'undefined') {
        this.tick();
      }
    }.bind(this));
  }

  this.counterEl = options.counterEl;
  this.generation = 0;
};

Game.prototype.toggle = function () {
  if (typeof this.intervalID === 'undefined') {
    this.intervalID = setInterval(this.tick.bind(this), 100);
    this.toggleEl.innerHTML = 'Stop';
  } else {
    clearInterval(this.intervalID);
    this.intervalID = undefined;
    this.toggleEl.innerHTML = 'Start';
  }
};

Game.prototype.tick = function () {
  this.board.tick();

  if (this.board.isStable()) {
    this.toggle();
    return;
  }

  this.generation++;
  if (typeof this.counterEl !== 'undefined') {
    this.counterEl.innerHTML = this.generation;
  }
};
