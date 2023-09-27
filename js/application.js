let currentQuestion;
let currentScore = 0;
let highScore = 0;
let secondsLeft = 10;
let interval;
let highestNumber = 10;

let pickNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// get labels with selected class and add to array, return the array of values of the for attribute
let pickOperator = function() {
  let selectedLabels = $('label[class="selected"]');
  if (selectedLabels.length === 0) {
    alert("You must have at least one operator selected.");
    $('label[for="addition"').toggleClass('selected');
    selectedLabels = $('label[class="selected"]');
  }
  let operatorsArray = [];
  $.each(selectedLabels, function(index, element) {
    operatorsArray.push(element.htmlFor);
  })
  return operatorsArray;
}

let questionMaker = function() {
  let question = {};
  let firstNumber = pickNumber(1, highestNumber);
  let secondNumber = pickNumber(1, highestNumber);
  let operators = pickOperator();
  let operator = operators[pickNumber(0, operators.length)]
  let operatorSymbol;

  // check for this in case any know-it-alls try injecting a zero through console
  if (highestNumber <= 0) {
    alert("We're not playing anymore if you're trying to divide by zero. That's how wars start.");
    return false;
  }

  if (operator === 'addition') {
    operatorSymbol = '+';
    question.answer = firstNumber + secondNumber;
  }
  else if (operator === 'subtraction') {
    operatorSymbol = '-';
    // don't allow a negative value with subtraction
    if(firstNumber - secondNumber < 0) {
      let placeholder = secondNumber;
      secondNumber = firstNumber;
      firstNumber = placeholder;
    }
    question.answer = firstNumber - secondNumber;
  }
  else if (operator === 'multiplication') {
    operatorSymbol = '*';
    question.answer = firstNumber * secondNumber;
  }
  else if (operator === 'division' && highestNumber !== 0) {
    operatorSymbol = '/';
    // just go to two decimals
    question.answer = (firstNumber / secondNumber).toFixed(2);
  }

  question.equation = String(firstNumber) + " " + String(operatorSymbol) + " " + String(secondNumber);
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

// get a question for first page load
newQuestion();

$(document).ready(function() {
  // toggle operator label background
  $('.operator-selector').click(function() {
    $('label[for="'+ $(this).prop('id') +'"]').toggleClass('selected');
    newQuestion();
  });

  $('#highest-number').on('keyup', function() {
    highestNumber = Number($(this).val());
    // numbers must be between 1 and 10000
    if (this.value < 1 || this.value > 10000) {
      alert('Numbers between 0 and 10000 only!');
      highestNumber = 10;
      $('#highest-number').val(10);
    }
    newQuestion();
  });

  $('#question').text(currentQuestion.equation);

  $('#answer').keyup(function() {
    startGame();
    evaluateAnswer(Number($(this).val()), Number(currentQuestion.answer));
  });
});
