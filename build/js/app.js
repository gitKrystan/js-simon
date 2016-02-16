(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var COLORS = ['red', 'yellow', 'green', 'blue'];

function Game() {
  this.sequence = [];
  this.userGuesses = [];
  this.turnCount = 0;
}

Game.prototype.getSequence = function () {
  return this.sequence;
};

Game.prototype.updateSequence = function() {
  var newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  var sequence = this.getSequence();
  sequence.push(newColor);
  return sequence;
};

Game.prototype.getUserGuesses = function () {
  return this.userGuesses;
};

Game.prototype.updateUserGuesses = function (guess) {
  var userGuesses = this.getUserGuesses();
  userGuesses.push(guess);
  return userGuesses;
};

Game.prototype.resetUserGuesses = function () {
  this.userGuesses = [];
  return this.userGuesses;
};

Game.prototype.guessMatchesSequence = function () {
  var sequence = this.getSequence();
  var userGuesses = this.getUserGuesses();

  for (var guessIndex in userGuesses) {
    if (userGuesses[guessIndex] !== sequence[guessIndex]) {
      return false;
    }
  }

  return true;
};

Game.prototype.guessIsWrong = function () {
  return !this.guessMatchesSequence();
};

Game.prototype.turnCompleted = function () {
  return this.getUserGuesses().length === this.getTurnCount();
};

Game.prototype.getTurnCount = function () {
  return this.turnCount;
};

Game.prototype.incrementTurnCount = function () {
  this.turnCount += 1;
  return this.turnCount;
};

module.exports = Game;

},{}],2:[function(require,module,exports){
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

},{"./../js/simon.js":1}]},{},[2]);
