//Tyler Mathena
//Last edited 4.29.19
//Displays trivia questions andd checks answers

//initialize global variables
//array to hold trivia questions
let questions = [];
const possibleCategories = ["Random", "General Knowledge", "Books", "Film", "Music", "Theatre", "Television", "Video Games", "Board Games", "Science/Nature", "Computers", "Math", "Mythology", "Sports", "Geography", "History", "Politics", "Art", "Celebrities", "Animals", "Vehicles", "Comics", "Gadgets", "Anime", "Cartoons"]
let selectedCategory;
let selectedDifficulty;
let num;
let answerArray;
let questionInterval;
let currentQuestion = 0;
let userAnswer = false;
let score = 0;

//HTML for the home page with dropdowns.
function renderHomePage() {

    return `
        <div class="row selectionArea">
            <div class ="col">
                <h2>Welcome to the Trivia Game</h2>
                <p class="info">Please select a category, difficulty, and quiz length from the dropdowns to the right. You will have 7 seconds to answer each question. Your score will be based solely on the number of correct answers, expressed as a percentage. Good luck.</p>
                <button class="start-btn">Start</button>
                <h4>Currently Selected</h4><hr/>
                <p class="number-display">Number of questions:</p>
                <p class="difficulty-display">Difficulty:</p>
                <p class="category-display">Category:</p>
            </div>
            <div class ="col">
                <form id="number-form">
                    <label for="number-input">Number of Questions</label>
                    <input type="text" id="number-input">
                    <input id="finalize-questions" type="submit" value="Submit">
                </form>
                <div class="dropdownSelect">
                    <div class="btn-group">
                        <button type="button" class="btn btn-danger dropdown-toggle difficulty" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            Difficulty
                        </button>
                        <div class="dropdown-menu">
                          <a class="dropdown-item difficulty-dropdown-item" style="font-size: 10;" data-value="easy">Easy</a>
                          <a class="dropdown-item difficulty-dropdown-item" style="font-size: 10;" data-value="medium">Medium</a>
                          <a class="dropdown-item difficulty-dropdown-item" style="font-size: 10;" data-value="hard">Hard</a>
                        </div>
                    </div>
                </div>
                <div class="dropdownSelect">
                    <div class="btn-group">
                        <button type="button" class="btn btn-danger dropdown-toggle category" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            Category
                        </button>
                        <div class="dropdown-menu category-target">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


$(".main-area").html(renderHomePage());

populateCategorySelection()

//in charge of populating the category selction dropdown
function populateCategorySelection() {
    for (let i = 0; i < possibleCategories.length; i++) {
        console.log(possibleCategories[i])
        $(".category-target").append(`<a class="dropdown-item category-dropdown-item" style="font-size: 10;" data-value="${possibleCategories[i]}">${possibleCategories[i]}</a>`)
    }
}

//click listener for submit button on number form
$("#finalize-questions").on("click", function (e) {
    //stops page from refreshing
    e.preventDefault();

    num = parseInt($("#number-input").val().trim());
    console.log(num);
    $(".number-display").text(`Number of Questions: ${num}`);
})

//click listener for difficulty
$(".difficulty-dropdown-item").on("click", function () {
    console.log(this);
    selectedDifficulty = $(this).attr("data-value");
    console.log(selectedDifficulty);
    $(".difficulty-display").text(`Difficulty: ${selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}`);
})

//click listener for Category select dropdown contents
$(".category-dropdown-item").on("click", function () {
    console.log(this);
    selectedCategory = $(this).attr("data-value");
    console.log(selectedCategory);
    $(".category-display").text(`Category: ${selectedCategory}`);
})

//click listener for the start quiz button
$(".start-btn").on("click", function () {
    console.log(selectedCategory);
    console.log(possibleCategories);
    let indexCategory;
    if (possibleCategories.indexOf(selectedCategory) === 0) {
        indexCategory = possibleCategories.indexOf(selectedCategory);
    } else {
        indexCategory = possibleCategories.indexOf(selectedCategory) + 8;
    }
    populateQuestions(num, indexCategory, selectedDifficulty);
    //console.log(possibleCategories.indexOf(selectedCategory)+8);
})

//Polls database for an array of questions
//Expected Parameters: (num = int > 0, category = int of 0 OR between 8 and 32, difficulty = string of "easy" "medium" or "hard")
function populateQuestions(num, category, difficulty) {

    const URL = `https://opentdb.com/api.php?amount=${num}&category=${category}&difficulty=${difficulty}&type=multiple`

    console.log(URL);

    $.ajax({
        url: URL,
        method: "GET"
    }).then(function (response) {
        questions = response.results;
        console.log(questions);
        startQuiz();
    });
}

//initializes the quiz
function startQuiz() {
    if (currentQuestion < questions.length) {
        userAnswer = false;
        $(".main-area").empty();
        //for (let i = 0; i < questions.length; i++) {
        console.log("Uh oh Spaghetti-Os");
        shuffleAnswers(questions[currentQuestion]);
        $(".main-area").append(renderQuestion(currentQuestion));

        $(".answer-btn").on("click", function () {
            userAnswer = $(this).attr("data-correct") == "true";
            console.log(userAnswer)
            clearInterval(questionInterval);
            transtion();
        })
        let difficultyMultiplier = 0;
        if(selectedDifficulty === "easy") {difficultyMultiplier = 1}
        else if (selectedDifficulty === "medium") {difficultyMultiplier = 2}
        else {difficultyMultiplier = 3;}
        //gives the user 3 seconds per difficulty point
        questionInterval = setTimeout(transtion, 4000*difficultyMultiplier);
    } else {
        gameOver();
    }



}

function transtion() {
    //$(".main-area").empty();
    if (userAnswer) {
        score++;
        $(".main-area").html(`
            <h1 style="text-align: center;">Question ${currentQuestion+1} was correct!</h1>
            <h2 style="text-align: center;">Your score is ${score}</h2>`
            );
    } else {
        $(".main-area").html(`
            <h1 style="text-align: center;">Question ${currentQuestion+1} was incorrect!</h1>
            <h2 style="text-align: center;">Your score is ${score}</h2>`
        );
    }
    currentQuestion++;
    setTimeout(startQuiz, 1000)
}

// Prepares answers into a nice little array for easy uploading
/* Expects a question object because the API outputs the correct answer
   as a different property than the incorrect answers. */
function shuffleAnswers(obj) {
    //adds correct answer
    answerArray = [{
        answer: obj.correct_answer,
        correct: true
    }];
    //adds incorrect answers
    for (let i = 0; i < 3; i++) {
        answerArray.push({
            answer: obj.incorrect_answers[i],
            correct: false
        });
    }
    console.log(answerArray)
    //shuffles using Fisher-Yates
    for (let i = answerArray.length - 1; i > 0; i--) {
        const newIndex = Math.floor(Math.random() * (i + 1));
        [answerArray[i], answerArray[newIndex]] = [answerArray[newIndex], answerArray[i]];
    }
    console.log(answerArray)

}

function renderQuestion(i) {
    //const
    return `
        <div class="row question-area">
            <div class="col">
                <h3>Question ${i + 1}: ${questions[i].question}</h3>
                <div>
                    <button class="answer-btn" id="question${i}" data-correct="${answerArray[0].correct}">${answerArray[0].answer}</button>
                </div>
                <div>
                    <button class="answer-btn" id="question${i}" data-correct="${answerArray[1].correct}">${answerArray[1].answer}</button>
                </div>
                <div>
                  <button class="answer-btn" id="question${i}" data-correct="${answerArray[2].correct}">${answerArray[2].answer}</button>
                </div>
                <div>
                   <button class="answer-btn" id="question${i}" data-correct="${answerArray[3].correct}">${answerArray[3].answer}</button>
                </div>
            </div>
        </div>
    `
}

function gameOver() {
    $(".main-area").html(`
      <h1 style="text-align: center;">Game Over!</h1>
      <h2 style="text-align: center;">Your score was ${score}/${currentQuestion}</h2>
      <h2 style="text-align: center;">Refresh the page to play again</h2>
    `)
}

