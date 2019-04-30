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

//HTML for the home page with dropdowns.
function renderHomePage () {

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
function populateCategorySelection () {
    for(let i = 0; i < possibleCategories.length; i++) {
        console.log(possibleCategories[i])
        $(".category-target").append(`<a class="dropdown-item category-dropdown-item" style="font-size: 10;" data-value="${possibleCategories[i]}">${possibleCategories[i]}</a>`)
    }
}

//click listener for submit button on number form
$("#finalize-questions").on("click", function(e) {
    //stops page from refreshing
    e.preventDefault();

    num = parseInt($("#number-input").val().trim());
    console.log(num);
    $(".number-display").text(`Number of Questions: ${num}`);
})

//click listener for difficulty
$(".difficulty-dropdown-item").on("click", function() {
    console.log(this);
    selectedDifficulty = $(this).attr("data-value");
    console.log(selectedDifficulty);
    $(".difficulty-display").text(`Difficulty: ${selectedDifficulty}`);
})

//click listener for Category select dropdown contents
$(".category-dropdown-item").on("click", function() {
    console.log(this);
    selectedCategory = $(this).attr("data-value");
    console.log(selectedCategory);
    $(".category-display").text(`Category: ${selectedCategory}`);
})

//click listener for the start quiz button
$(".start-btn").on("click", function () {
    console.log(selectedCategory);
    console.log(possibleCategories);
    populateQuestions(num, (possibleCategories.indexOf(selectedCategory)+8), selectedDifficulty);
    console.log(possibleCategories.indexOf(selectedCategory)+8);
    startQuiz();
})

//Polls database for an array of questions
//Expected Parameters: (num = int > 0, category = int of 0 OR between 8 and 32, difficulty = string of "easy" "medium" or "hard")
function populateQuestions (num, category, difficulty) {

    const URL = `https://opentdb.com/api.php?amount=${num}&category=${category}&difficulty=${difficulty}&type=multiple`

    console.log(URL);

    $.ajax({
        url: URL,
        method: "GET"
    }).then(function (response) {
        questions = response.results;
        console.log(questions);
    });
}

function startQuiz () {
    $(".main-area").html(`<p>${JSON.stringify(questions)}</p>`)
    
}

