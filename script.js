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
                processGuess(word);
                moveNextRow();
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
        showCongratsModal(currentRow);
      }
    }
  
    function provideFeedback(guess) {
      const feedback = [];
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
          feedback.push("correct-position");
          remainingOccurrences[guessedLetter]--;
        } else if (remainingOccurrences[guessedLetter] > 0) {
          feedback.push("wrong-position");
          remainingOccurrences[guessedLetter]--;
        } else {
          feedback.push("incorrect");
          if (!answer.includes(guessedLetter)) {
            const keyboard_key = document.getElementById(
              guessedLetter.toUpperCase(),
            );
            keyboard_key.classList.add("not-included");
          }
        }
      }
  
      return feedback;
    }
  
    function updateUI(feedback) {
      // Update the UI based on the feedback
      for (let i = 1; i <= feedback.length; i++) {
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
      document.body.appendChild(errorMessage);
  
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  
    function showCongratsModal(guesses) {
      var modalContent = document.getElementById("modalContent");
  
      // Replace {guesses} with the actual number of rows
      var statsText = "WORDLE " + guesses + "/6\n";
  
      // Replace 🟨🟩⬜ with the actual situations in the rows and boxes
      var row1 = "⬜⬜🟩⬜⬜";
      var row2 = "⬜🟨🟩⬜⬜";
      var row3 = "⬜⬜🟩⬜🟨";
      var row4 = "⬜⬜🟩⬜⬜";
      var row5 = "🟩🟩🟩🟩🟩";
  
      statsText += row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + row5;
  
      modalContent.textContent = statsText;
  
      // Show the modal
      $("#congratsModal").modal("show");
    }
  
    function copyStats() {
      var statsText = document.getElementById("modalContent").textContent;
  
      var tempInput = document.createElement("textarea");
      tempInput.value = statsText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
  
      alert("Stats copied to clipboard!");
    }
  
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
  