var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var playerName = "";
var highScores = {};

// When the document is ready
$(document).ready(function () {
    loadHighScores(); // Load high scores on startup

    // Show rules and player form when clicking the instructions button
    $("#simon-button").click(function () {
        $("#rules").fadeIn(500);
        $("#simon-button").fadeOut(500);
        $("#player-form").fadeIn(500); // Show the player form
        $("h2").fadeOut(500); // Hide the instruction text
    });

    // When the player submits their name or presses Enter
    $("#name-submit").click(submitName);
    $("#player-name").keypress(function (event) {
        if (event.key === "Enter") {
            submitName();
        }
    });

    // Start the game
    $("#start-button").click(function () {
        $("#start-button").fadeOut(500);
        resetGame();
        nextSequence();
    });

    // Restart the game
    $("#restart-button").click(function () {
        $("#player-form").fadeIn(500); // Ask for player name again
        $("#restart-button").fadeOut(500);
    });

    // Handle button clicks
// Handle button clicks
$(".btn").on("click touchstart", function (event) {
    event.preventDefault(); // Prevent any default behavior for touch events
    if (started) {
        var userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        playSound(userChosenColour);
        animatePress(userChosenColour);
        checkAnswer(userClickedPattern.length - 1);
    }
});


    // Handle keydown events
    $(document).keydown(function (event) {
        if (!started && (event.key === "r" || event.key === "Enter")) {
            $("#player-form").fadeIn(500); // Ask for player name again
        }

        if (started) {
            if (event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") {
                var userChosenColour;
                switch (event.key) {
                    case "w":
                        userChosenColour = "green";
                        break;
                    case "a":
                        userChosenColour = "yellow";
                        break;
                    case "s":
                        userChosenColour = "blue";
                        break;
                    case "d":
                        userChosenColour = "red";
                        break;
                }
                userClickedPattern.push(userChosenColour);
                playSound(userChosenColour);
                animatePress(userChosenColour);
                checkAnswer(userClickedPattern.length - 1);
            }
        }
    });
});

// Function to submit the player name
function submitName() {
    playerName = $("#player-name").val().trim();
    if (playerName) {
        $("#player-form").fadeOut(500);
        $("#high-scores").fadeIn(500);
        $("#start-button").fadeIn(500);
        updateScoreList(); // Update high scores display
    } else {
        alert("Please enter your name!"); // Alert if no name is entered
    }
}

// Function to check player's answer
// Existing checkAnswer function
function checkAnswer(currentLevel) {
    console.log("User Pattern:", userClickedPattern);
    console.log("Game Pattern:", gamePattern);
    
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("Correct!");
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                nextSequence(); // Move to the next sequence if the answer is correct
            }, 1000);
        }
    } else {
        console.log("Wrong!");
        playSound("Sarle"); // Play wrong sound
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Restart or 'R' to Try Again").fadeIn(500);
        $("#restart-button").fadeIn(500);
        updateHighScore(); // Update high score on game over
        started = false; // Game over, set started to false
    }
}


// Function to generate the next sequence
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    switch (true) {
        case (level % 10 === 0):
            playSound("Wahh"); // Sound for every 10 levels
            break;
        case (level % 5 === 0):
            playSound("Eyuuu"); // Sound for every 5 levels
            break;
    }

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
    
    // Highlight the active color
    $("#" + randomChosenColour).addClass("active");
    
    // Remove the active class after a short delay
    setTimeout(function () {
        $("#" + randomChosenColour).removeClass("active");
    }, 300); // Adjust timing for more visibility
}

// Function to play sound
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

// Function to animate button press
function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

// Function to reset the game
function resetGame() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = true; // Set started to true to indicate the game has begun
    $("#level-title").text("Level " + level); // Reset the title
    $("#restart-button").hide(); // Hide the restart button when resetting
}

// Load high scores from local storage
function loadHighScores() {
    if (localStorage.getItem('highScores')) {
        highScores = JSON.parse(localStorage.getItem('highScores'));
    } else {
        highScores = {}; // Initialize if not present
    }
}

// Update the score list displayed in the high scores section
function updateScoreList() {
    $("#score-list").empty();
    Object.keys(highScores).forEach(function (name) {
        $("#score-list").append("<li>" + name + ": " + highScores[name] + "</li>");
    });
}

// Update the high score
function updateHighScore() {
    if (playerName) {
        // Update high score if this is a new high score
        if (!highScores[playerName] || highScores[playerName] < level) {
            highScores[playerName] = level;
            localStorage.setItem('highScores', JSON.stringify(highScores));
        }
        updateScoreList(); // Update the displayed high scores
    }
}
