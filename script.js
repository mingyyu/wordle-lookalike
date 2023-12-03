document.addEventListener("DOMContentLoaded", function () {
    const wordListURL = "words.txt"; // Adjust the URL to your word list file
    var currentRow = 1;
    var currentBox = 1;
  
    // Fetch the word list and handle the submission logic
    fetch(wordListURL)
      .then((response) => response.text())
      .then((data) => {
        const wordArray = data.split("\n").filter((word) => word.length === 5);
  
        document
          .getElementById("submitBtn")
          .addEventListener("click", function () {
            const word = getCurrentWord();
            if (word.length === 5) {
              if (wordArray.includes(word.toLowerCase())) {
                console.log(`${word} is a valid English word!`);
                moveNextRow();
              } else {
                console.log(`${word} is not a valid English word.`);
                displayErrorMessage();
                resetRow();
              }
            } else {
              console.log("Word must be 5 letters long.");
              // Add your logic for an invalid word length
            }
          });
      })
      .catch((error) => {
        console.error("Error reading the word list:", error);
      });
  
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
    function displayErrorMessage() {
      const errorMessage = document.createElement("div");
      errorMessage.textContent = "No such word exist";
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
  