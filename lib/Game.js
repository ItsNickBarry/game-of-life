if (typeof GameOfLife === "undefined") {
  window.GameOfLife = {};
}

var Game = window.GameOfLife.Game = function (options) {
  if (typeof options.boardEl === 'undefined') {
    throw "Game must be passed an element to occupy"
  }

  this._board = new GameOfLife.Board({
    el: options.boardEl,
    height: options.height,
    width: options.width,
    startLiveChance: options.startLiveChance
  });

  if (typeof options.toggleEl === 'undefined') {
    this.toggle();
  } else {
    this._toggleEl = options.toggleEl;
    this._toggleEl.addEventListener('click', function (event) {
      this.toggle();
    }.bind(this));
  }

  if (typeof options.resetEl !== 'undefined') {
    this._resetEl = options.resetEl;
    this._resetEl.addEventListener('click', function (event) {
      if (typeof this._counterEl !== 'undefined') {
        this._counterEl.classList.remove('completed');
      }
      if (this.isActive()) {
        this.stop();
      }
      this._board.initializeCells();
      this._generation = 0;
      this.updateCounter();
    }.bind(this));
  }

  if (typeof options.tickEl !== 'undefined') {
    this._tickEl = options.tickEl;
    this._tickEl.addEventListener('click', function (event) {
      if (!this.isActive()) {
        this.tick();
      }
    }.bind(this));
  }

  this._counterEl = options.counterEl;
  this._generation = 0;
};

Game.prototype.isActive = function () {
  return typeof this._intervalId !== 'undefined';
};

Game.prototype.toggle = function () {
  if (this.isActive()) {
    this.stop();
  } else {
    this.start();
  }
};

Game.prototype.start = function () {
  this._intervalId = setInterval(this.tick.bind(this), 100);
  if (typeof this._toggleEl !== 'undefined') {
    this._toggleEl.innerHTML = '<span><i class="fa fa-pause"></i></span>';
  }
};

Game.prototype.stop = function () {
  clearInterval(this._intervalId);
  this._intervalId = undefined;
  if (typeof this._toggleEl !== 'undefined') {
    this._toggleEl.innerHTML = '<span><i class="fa fa-play"></i></span>';
  }
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

Game.prototype.setCompleted = function () {
  this.stop();
  if (typeof this._counterEl !== 'undefined') {
    this._counterEl.classList.add('completed');
  }
}

Game.prototype.updateCounter = function () {
  if (typeof this._counterEl !== 'undefined') {
    this._counterEl.innerHTML = this._generation;
  }
};
