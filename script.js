// write javascript here
const API = `https://opentdb.com/api.php?`;

const form = document.querySelector(".quiz-form");
const startQuizBtn = document.querySelector(".btn-submit");

const screen1 = document.querySelector(".screen-1");
const screen2 = document.querySelector(".screen-2");
const screen3 = document.querySelector(".screen-3");
const score = document.querySelector(".score");
const finalScore = document.querySelector(".ts-score");
const queNo = document.querySelector(".que-no");
const question = document.querySelector(".question");
const option1 = document.querySelector(".opt-1");
const option2 = document.querySelector(".opt-2");
const option3 = document.querySelector(".opt-3");
const option4 = document.querySelector(".opt-4");
const nextQues = document.querySelector(".btn-next");
const quitQuiz = document.querySelector(".btn-quit");
const newQuiz = document.querySelector(".btn-new-quiz");
const correctAnswer = document.querySelector(".correct-answer");
const displayCorrectAnswer = document.querySelector(".answer");

let quizData;
let quizAmount;
let optionElements;
let number = 0;
let currentScore = 0;

const quizSettingDataFormation = function (data) {
  const extractedValues = data
    .split("&")
    .filter((value) => !value.includes(" "))
    .join("&");

  return extractedValues;
};

const gettingData = async function (quizSettingData) {
  try {
    const res = await fetch(`${API}${quizSettingData}`);

    const data = await res.json();
    console.log(data.results);
    return data.results;
  } catch (err) {
    console.log(err);
  }
};

startQuizBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  quizAmount = document.querySelector(".no-of-que").value;

  const category = document.querySelector(".category").value;
  const difficulty = document.querySelector(".diff").value;
  const type = document.querySelector(".type").value;

  const Data = `amount=${quizAmount}&category=${category}&difficulty=${difficulty}&type=${type}`;

  quizData = await gettingData(quizSettingDataFormation(Data));
  screen1.classList.add("hidden");
  screen2.classList.remove("hidden");

  displayQuestion(quizData, quizAmount);
});

const nextQue = function () {
  setTimeout(() => {
    number++;

    if (number < quizAmount) {
      displayQuestion(quizData, quizAmount);
    }

    if (number >= quizAmount) {
      screen2.classList.add("hidden");
      screen3.classList.remove("hidden");

      finalScore.textContent = `${currentScore} / ${quizAmount}`;
    }
  }, 1000);
};

const displayQuestion = function (data, amount) {
  queNo.textContent = `Question No. : ${number + 1} / ${amount}`;
  question.textContent = `${decodeHtmlEntities(data[number].question)}`;
  score.textContent = `Score: ${currentScore}`;
  displayCorrectAnswer.classList.add("hidden");

  if (number === quizAmount - 1 || number === quizAmount) {
    nextQues.textContent = "Submit Quiz";
  }

  if (data[number].type === "boolean") {
    optionElements = [option1, option2];
    option3.classList.add("hidden");
    option4.classList.add("hidden");
  } else {
    optionElements = [option1, option2, option3, option4];
    option3.classList.remove("hidden");
    option4.classList.remove("hidden");
  }

  const answerChoices = data[number].incorrect_answers.slice();
  answerChoices.push(data[number].correct_answer);

  shuffleArray(answerChoices);

  for (let i = 0; i < optionElements.length; i++) {
    let answers = decodeHtmlEntities(answerChoices[i]);
    data[number].incorrect_answers = decodeHtmlEntities(
      data[number].incorrect_answers
    );
    data[number].correct_answer = decodeHtmlEntities(
      data[number].correct_answer
    );
    optionElements[i].textContent = answers;
    optionElements[i].style.backgroundColor = "white";
    optionElements[i].style.color = "black";

    optionElements[i].addEventListener("click", function () {
      if (answers === data[number].correct_answer) {
        currentScore++;
        optionElements[i].style.backgroundColor = "rgb(13, 168, 13)";
        optionElements[i].style.color = "white";
        displayCorrectAnswer.classList.add("hidden");
        nextQue();
      } else {
        optionElements[i].style.backgroundColor = "rgb(252, 36, 36)";
        correctAnswer.textContent = `${data[number].correct_answer}`;

        displayCorrectAnswer.classList.remove("hidden");
      }
    });
  }
};

const shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const decodeHtmlEntities = function (text) {
  const tempEl = document.createElement("div");
  tempEl.innerHTML = text;
  return tempEl.textContent;
};

nextQues.addEventListener("click", function () {
  nextQue();
});

quitQuiz.addEventListener("click", function () {
  screen2.classList.add("hidden");
  screen3.classList.remove("hidden");
  finalScore.textContent = `${currentScore} / ${quizAmount}`;
  number = 0;
  currentScore = 0;
});

newQuiz.addEventListener("click", function () {
  screen3.classList.add("hidden");
  screen1.classList.remove("hidden");

  location.reload();
});
