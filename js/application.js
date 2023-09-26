let currentQuestion;
let currentScore = 0;
let highScore = 0;
let secondsLeft = 10;
let interval;
let highestNumber = 10;

let pickNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let pickOperator = function() {
  let operators = ['+', '-', '*', '/'];
  let operatorNum = pickNumber(0, 4);
  return operators[operatorNum];
}

let questionMaker = function() {
  let question = {};
  let firstNumber = pickNumber(1, highestNumber);
  let secondNumber = pickNumber(1, highestNumber);
  let operator = pickOperator();
  if (highestNumber <= 0) {
    alert("We're not playing anymore if you're trying to divide by zero. That's how wars start.");
    return false;
  }
  if (operator === "+") {
    question.answer = firstNumber + secondNumber;
  }
  else if (operator === '-') {
    if(firstNumber - secondNumber < 0) {
      let placeholder = secondNumber;
      secondNumber = firstNumber;
      firstNumber = placeholder;
    }
    question.answer = firstNumber - secondNumber;
  }
  else if (operator === '*') {
    question.answer = firstNumber * secondNumber;
  }
  else if (operator === '/' && highestNumber !== 0) {
    // just go to two decimals
    question.answer = (firstNumber / secondNumber).toFixed(2);
  }
  question.equation = String(firstNumber) + " " + String(operator) + " " + String(secondNumber);
  return question;
}

let newQuestion = function () {
  currentQuestion = questionMaker();
  $('#question').text(currentQuestion.equation);
}

let updateTime = function(seconds) {
  secondsLeft += seconds;
  $("#seconds-left").text(secondsLeft);
}

let updateScore = function(amount) {
  currentScore += amount;
  $('#current-score').text(currentScore);
}

let updateHighScore = function() {
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  $('#high-score').text(highScore);
}

let evaluateAnswer = function(userInput, answer) {
  $('#your-answer').text(userInput);
  if (userInput === answer) {
    newQuestion();
    $('#answer').val('');
    updateTime(1);
    updateScore(1);
    updateHighScore();
  }
}

let startGame = function() {
  if (!interval) {
    if (secondsLeft === 0) {
      updateTime(10);
      updateScore(-currentScore);
    }
    interval = setInterval(function() {     
      updateTime(-1);
      $('#seconds-left').text(secondsLeft);
      if (secondsLeft === 0) {
        clearInterval(interval);
        interval = undefined;
      }
    }, 1000);
  }
}

newQuestion();

$(document).ready(function() {
  $('#highest-number').on('keyup', function() {
    highestNumber = Number($(this).val());
    // numbers must be 1 or greater
    if(!(/^(?!0(\.0*)?$)\d+(\.?\d{0,2})?$/).test(this.value)) {
      alert('Numbers over zero only!');
      highestNumber = 10;
      $('#highest-number').val(10);
    }
    newQuestion();
  });

  $('#question').text(currentQuestion.equation);

  $('#answer').on('keyup', function() {
    startGame();
    evaluateAnswer(Number($(this).val()), Number(currentQuestion.answer));
  });
});
