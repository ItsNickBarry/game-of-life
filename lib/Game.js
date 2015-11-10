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

  this.intervalID = setInterval(this.step.bind(this), 1000);
};

Game.prototype.step = function () {
  this.board.step();

  if (this.board.isStable()) {
    clearInterval(this.intervalID);
    // TODO message indicating completion
  }

  //TODO make sure generation is not updated too much
  this.generation++;
  //TODO update counter
};
