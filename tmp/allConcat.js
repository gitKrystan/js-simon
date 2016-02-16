var Game = require('./../js/simon.js');
var TIME_BETWEEN_FLASHES = 800;
var FLASH_DURATION = 100;

$(function() {
  var currentGame;

  $('#start-game').click(function() {
    currentGame = startNewGame();
  });

  function startNewGame() {
    currentGame = new Game();
    runOneTurn();
    return currentGame;
  }

  function runOneTurn() {
    var turnCount = currentGame.incrementTurnCount();
    $('#start-game p').text(turnCount);
    $('.simon-cell').unbind('click');
    updateAndDisplaySequence();
    scheduleTurnForGame(turnCount);
  }

  function updateAndDisplaySequence() {
    var sequence = currentGame.updateSequence();

    var colorIndex = 0;
    setInterval(function() {
      chooseAndFlashCell(sequence[colorIndex]);
      colorIndex++;
      if (colorIndex === sequence.length - 1) {
        return false;
      }
    }, TIME_BETWEEN_FLASHES);
  }

  function scheduleTurnForGame(turnCount) {
    setTimeout(userTurn, turnCount * TIME_BETWEEN_FLASHES);
  }

  function userTurn() {
    $('.simon-cell').click(onUserClick);
  }

  function flashChosenCell(target) {
    target.addClass('flash');

    var removeFlashClassFromClickedCell = (function () {
        $(this).removeClass('flash');
    }).bind(target);

    setTimeout(removeFlashClassFromClickedCell, FLASH_DURATION);
  }

  function chooseAndFlashCell(target) {
    var $chosenCell = $('div#' + target);
    flashChosenCell($chosenCell);
  }

  function onUserClick() {
    var $chosenCell = $(this);
    flashChosenCell($chosenCell);

    var cellID = this.id;
    currentGame.updateUserGuesses(cellID);

    if (currentGame.guessIsWrong()) {
      gameOver();
    } else if (currentGame.turnCompleted()) {
      startNextTurn();
    }
  }

  function gameOver() {
    newGameResponse = window.confirm('Game Over! You survived ' +
      (currentGame.getTurnCount() - 1) + ' turns. Start a new game?');
    if (newGameResponse) {
      waitBefore(startNewGame);
    }
  }

  function startNextTurn() {
    currentGame.resetUserGuesses();
    waitBefore(runOneTurn);
  }

  function waitBefore(callback) {
    setTimeout(callback, TIME_BETWEEN_FLASHES);
  }
});
