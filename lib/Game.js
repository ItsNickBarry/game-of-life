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
    startLiveChance: .3
  });

  this.generation = 0;
};

Game.prototype.start = function () {
  this.intervalID = setInterval(this.tick.bind(this), 100);
};

Game.prototype.tick = function () {
  this.board.tick();

  if (this.board.isStable()) {
    clearInterval(this.intervalID);
    console.log('board is stable; game ending');
    return;
  }

  //TODO make sure generation is not updated too much
  this.generation++;
  //TODO update counter
};
