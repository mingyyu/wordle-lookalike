document.addEventListener("DOMContentLoaded", function () {
    const wordListURL = "words.txt"; // Adjust the URL to your word list file
    var currentRow = 1;
    var currentBox = 1;
  
    let answer = "";
  
    // Fetch the word list and handle the submission logic
    fetch(wordListURL)
      .then((response) => response.text())
      .then((data) => {
        const wordArray = data.split("\n").filter((word) => word.length === 5);
  
        answer =
          wordArray[Math.floor(Math.random() * wordArray.length)].toLowerCase();
  
        // Initialize the game (e.g., set up UI, display instructions)
        initializeGame();
  
        document
          .getElementById("submitBtn")
          .addEventListener("click", function () {
            const word = getCurrentWord().toLowerCase();
            if (word.length === 5) {
              if (wordArray.includes(word)) {
                console.log(`${word} is a valid English word!`);
                result_of_word = processGuess(word);
                moveNextRow();
                if (currentRow >= 7 && result_of_word === 0) {
                  showResultsModal(6, 1);
                }
              } else {
                displayErrorMessage(`${word} is not a valid English word.`);
                resetRow();
              }
            } else {
              displayErrorMessage("Word must be 5 letters long.");
              // Add your logic for an invalid word length
            }
          });
      })
      .catch((error) => {
        console.error("Error reading the word list:", error);
      });
  
    function initializeGame() {
      // Add your game initialization logic here
      // For example, set up the UI, display instructions, etc.
    }
  
    function processGuess(guess) {
      // Check the guess against the answer
      const feedback = provideFeedback(guess);
  
      // Update the UI based on the feedback
      updateUI(feedback);
  
      // Check if the guess is correct
      if (guess === answer) {
        showResultsModal(currentRow, 0);
        return 1;
      } else {
        return 0;
      }
    }
  
    function provideFeedback(guess) {
      const feedback = {};
      const remainingOccurrences = {};
  
      // Initialize remainingOccurrences with the occurrences of each letter in the answer
      for (const letter of answer) {
        remainingOccurrences[letter] = (remainingOccurrences[letter] || 0) + 1;
      }
  
      // Compare each letter in the guess with the corresponding letter in the answer
      for (let i = 0; i < answer.length; i++) {
        const guessedLetter = guess[i];
  
        if (
          guessedLetter === answer[i] &&
          remainingOccurrences[guessedLetter] > 0
        ) {
          feedback[i] = "correct-position";
          remainingOccurrences[guessedLetter]--;
        }
      }
      for (let i = 0; i < answer.length; i++) {
        const guessedLetter = guess[i];
        if (
          remainingOccurrences[guessedLetter] > 0 &&
          guessedLetter != answer[i]
        ) {
          feedback[i] = "wrong-position";
          remainingOccurrences[guessedLetter]--;
        } else if (!(guessedLetter === answer[i])) {
          feedback[i] = "incorrect";
          if (!answer.includes(guessedLetter)) {
            const keyboard_key = document.getElementById(
              guessedLetter.toUpperCase(),
            );
            keyboard_key.classList.add("not-included");
          }
        }
      }
      console.log(feedback);
      return feedback;
    }
  
    function updateUI(feedback) {
      // Update the UI based on the feedback
      for (let i = 1; i <= Object.keys(feedback).length; i++) {
        const box = document.getElementById(`box${currentRow}${i}`);
        box.classList.remove("correct-position", "wrong-position", "incorrect");
        box.style.color = "#ffffff";
  
        if (feedback[i - 1] === "correct-position") {
          box.classList.add("correct-position");
        } else if (feedback[i - 1] === "wrong-position") {
          box.classList.add("wrong-position");
        } else {
          box.classList.add("incorrect");
        }
      }
    }
  
    // Function to get the current word from the boxes
    function getCurrentWord() {
      let word = "";
      for (let i = 1; i <= 5; i++) {
        word += document.getElementById(`box${currentRow}${i}`).innerHTML || "";
      }
      return word;
    }
  
    // Function to move to the next row
    function moveNextRow() {
      currentRow++;
      currentBox = 1;
      //resetRow(); // Reset the current row (optional, adjust as needed)
    }
  
    // Function to reset the current row
    function resetRow() {
      for (let i = 1; i <= 5; i++) {
        box_to_empty = document.getElementById(`box${currentRow}${i}`);
        box_to_empty.innerHTML = "";
        box_to_empty.style.borderColor = "#c4c4c4";
      }
      currentBox = 1;
    }
  
    // Function to display an error message for 5 seconds
    function displayErrorMessage(message) {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = message;
      errorMessage.className = "alert alert-secondary";
      errorMessage.style.position = "fixed";
      errorMessage.style.top = "20%";
      errorMessage.style.left = "50%";
      errorMessage.style.transform = "translate(-50%, -50%)";
      errorMessage.style.zIndex = "10000";
      document.body.appendChild(errorMessage);
  
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  
    function showResultsModal(guesses, result) {
      var modalTitle = document.getElementById("resultsModalLabel");
      var modalContent = document.getElementById("modalContent");
      // Replace {guesses} with the actual number of rows
      var statsText = "WORDLE " + guesses + "/6<br><br>";
      for (let i = 1; i <= guesses; i++) {
        for (let j = 1; j <= 5; j++) {
          var box = document.getElementById("box" + i + j);
          if (box.classList.contains("correct-position")) {
            statsText += "🟩";
          } else if (box.classList.contains("wrong-position")) {
            statsText += "🟨";
          } else {
            statsText += "⬜";
          }
        }
        statsText += "<br>";
      }
  
      modalTitle.innerHTML =
        ["Congratulations! ", "Try again! "][result] +
        "The word was " +
        answer +
        ".";
      modalContent.innerHTML = statsText;
  
      // Show the modal
      //$("#resultsModal").modal("show");
      var results_modal = new bootstrap.Modal(
        document.getElementById("resultsModal"),
      );
      results_modal.toggle();
    }
  
    document.getElementById("copyStats").addEventListener("click", function () {
      var text_to_copy = document
        .getElementById("modalContent")
        .innerText.replace("<br>", "\n"); //textContent
      console.log(text_to_copy);
      if (!navigator.clipboard) {
        displayErrorMessage("Failed to copy stats");
      } else {
        navigator.clipboard
          .writeText(text_to_copy)
          .then(function () {
            displayErrorMessage("Copied to clipboard!"); // success
          })
          .catch(function () {
            displayErrorMessage("Failed to copy stats"); // error
          });
      }
    });
  
    // Add a click event listener to each keyboard button
    document.querySelectorAll(".keyboard-button").forEach(function (button) {
      button.addEventListener("click", function () {
        // Get the letter associated with the button
        var letter = button.dataset.letter;
  
        // Find the current row and box
        var row = document.getElementById("row" + currentRow);
        var box = document.getElementById("box" + currentRow + currentBox);
  
        // Check if the current box is empty
        if (box.innerHTML === "") {
          // Place the letter in the current box
          box.innerHTML = letter;
          box.style.borderColor = "#a1a1a1";
          // Move to the next box
          currentBox++;
        } else {
          // Find the next available box in the current row
          while (
            currentBox <= 5 &&
            document.getElementById("box" + currentRow + currentBox).innerHTML !==
              ""
          ) {
            currentBox++;
          }
  
          // If all boxes in the current row are occupied, move to the next row
          if (currentBox > 5) {
            currentRow++;
            currentBox = 1;
  
            // If all rows are occupied, you may want to handle this condition
          }
  
          // Place the letter in the next available box
          document.getElementById("box" + currentRow + currentBox).innerHTML =
            letter;
          // Move to the next box
          currentBox++;
        }
      });
    });
  
    document
      .getElementById("removeLetterBtn")
      .addEventListener("click", function () {
        // Get the latest letter box in the current row
        var latestLetterBox = document.getElementById(
          "box" + currentRow + (currentBox - 1),
        );
  
        // Check if the box is not already empty
        if (latestLetterBox.innerHTML !== "") {
          // Remove the latest letter
          latestLetterBox.innerHTML = "";
          latestLetterBox.style.borderColor = "#c4c4c4";
  
          // Optionally, you may want to update your logic for tracking the current box
          currentBox--;
  
          // If the current box is less than 1, move to the previous row
          if (currentBox < 1) {
            currentRow--;
            currentBox = 5; // Assuming 5 boxes per row, adjust as needed
  
            // If the current row is less than 1, reset to the last row
            if (currentRow < 1) {
              currentRow = 1;
            }
          }
        }
      });
  });
  