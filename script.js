document.addEventListener("DOMContentLoaded", function () {
  const wordListURL = "words.txt"; // Adjust the URL to your word list file
  var currentRow = 1;
  var currentBox = 1;
  var currentData = getGameData();
  var game_mode = currentData.gameMode;
  document.getElementById("gameModeDropdown").innerHTML = [
    "Daily",
    "Unlimited",
  ][game_mode];
  document.getElementById("changeGameMode").innerHTML = ["Unlimited", "Daily"][
    game_mode
  ];

  function calcPercentage(wins, losses) {
    try {
      percent = Math.round((wins / (wins + losses)) * 100);
    } catch (error) {
      percent = "nAn";
    }
    return percent;
  }

  function updateDailyData() {
    currentData = getGameData();
    document.getElementById("displayWins").innerHTML = currentData.winsDaily;
    document.getElementById("displayLosses").innerHTML =
      currentData.lossesDaily;
    document.getElementById("displayPercent").innerHTML = calcPercentage(
      currentData.winsDaily,
      currentData.lossesDaily,
    );
  }
  updateDailyData();

  var pauseGame = 1;
  var first_attempt = 0;
  var currentDay = getCurrentDay();
  const delay = 500; // Adjust the delay (in milliseconds) between each box

  function getGameData() {
    const storedData = localStorage.getItem("gameData");
    return storedData
      ? JSON.parse(storedData)
      : {
          winsDaily: 0,
          lossesDaily: 0,
          gameMode: 0,
          currentDay: -1,
          storedGuesses: [],
        };
  }

  // Function to update and save game statistics to localStorage
  function updateGameData(stat, outcome) {
    if (pauseGame === 1 && stat != 2) {
      return;
    }
    let gameData = getGameData();
    if (stat == 2) {
      gameData.gameMode = outcome;
      localStorage.setItem("gameData", JSON.stringify(gameData));
      return;
    }
    if (game_mode == 1) {
      return;
    }
    if (gameData.currentDay != currentDay) {
      gameData.currentDay = currentDay;
      gameData.storedGuesses = [];
    }
    if (stat == 3) {
      gameData.storedGuesses.push(outcome);
    } else if (stat == 4) {
      gameData.storedGuesses.pop();
    } else if (stat == 0) {
      gameData.winsDaily++;
    } else if (stat == 1) {
      gameData.lossesDaily++;
    }

    // Save updated statistics to localStorage
    localStorage.setItem("gameData", JSON.stringify(gameData));
  }

  let answer = "111111";

  function initializeGame() {
    stored_data = getGameData();
    gameModeDisplay = document.getElementById("gameModeDisplay");
    gameModeDisplay.innerHTML = ["DAILY", "UNLIMITED"][stored_data.gameMode];

    if (
      stored_data.storedGuesses != [] &&
      stored_data.currentDay == currentDay &&
      game_mode === 0
    ) {
      for (let i = 0; i < stored_data.storedGuesses.length; i++) {
        document
          .querySelector(
            `.keyboard-button[data-letter="${stored_data.storedGuesses[i]}"]`,
          )
          .click();
        if (currentBox >= 6) {
          document.getElementById("submitBtn").click();
        }
      }
    }
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

  function sleep(ms) {
    if (pauseGame >= 1 && pauseGame != 2 && ms != 600) {
      return;
    }
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        resolve();
      }, ms);
    });
  }

  async function updateUI(feedback) {
    const rowStaysTheSame = currentRow;
    // Update the UI based on the feedback
    for (let i = 1; i <= Object.keys(feedback).length; i++) {
      const box = document.getElementById(`box${rowStaysTheSame}${i}`);
      box.classList.remove("correct-position", "wrong-position", "incorrect");
      actual_delay = 0.25 * (i - 1) * delay;
      await sleep(actual_delay);
      box.classList.add("flipped");
      await sleep(0.5 * delay);

      box.style.color = "#ffffff";
      if (feedback[i - 1] === "correct-position") {
        box.classList.add("correct-position");
      } else if (feedback[i - 1] === "wrong-position") {
        box.classList.add("wrong-position");
      } else {
        box.classList.add("incorrect");
      }

      // Initiate negative 90-degree rotation
      box.classList.add("flipped-back");
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
      updateGameData(4, 0);
    }
    currentBox = 1;
  }

  // Function to display an error message for 5 seconds
  function displayMessage(message) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.className = "alert alert-dark error-message";
    document.body.appendChild(errorMessage);

    setTimeout(() => {
      document.body.removeChild(errorMessage);
    }, 3000);
  }

  async function showResultsModal(guesses, result) {
    pauseGame = 2;
    var modalTitle = document.getElementById("resultsModalLabel");
    // Replace {guesses} with the actual number of rows
    var statsText =
      "WORDLE " +
      ["Daily " + currentDay, "Unlimited"][game_mode] +
      " <br>" +
      currentRow +
      "/6<br><br>";

    meanings = getWordMeaning(answer);
    modalTitle.innerHTML =
      ["Congratulations!", "Try again!"][result] +
      " <br>The word was " +
      answer +
      ".";

    // Show the modal
    //$("#resultsModal").modal("show");
    await sleep(2500);
    if (first_attempt === 1) {
      updateGameData(result, 0);
      updateDailyData();
      displayMessage(
        [
          ["Seer", "Lucky", "Talented", "Good", "Average", "Sigh of relief"][
            currentRow - 2
          ],
          "RIP",
        ][result],
      );
    }
    await sleep(1000);
    pauseGame = 3;

    for (let i = 1; i <= currentRow - 1; i++) {
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
      statsText += "\n";
    }

    const copyStatsButton = document.getElementById("copyStats");

    copyStatsButton.dataset.stats =
      statsText + "\nPlay at mingyyu.github.io/wordle-lookalike";

    var results_modal = new bootstrap.Modal(
      document.getElementById("resultsModal"),
    );
    results_modal.toggle();
  }

  function getCurrentDay() {
    var startDateUTC = new Date("2023-12-01");
    var endDateUTC = new Date();

    startDateUTC.setUTCHours(0, 0, 0, 0);
    endDateUTC.setUTCHours(0, 0, 0, 0);

    var timeDifferenceUTC = endDateUTC.getTime() - startDateUTC.getTime();
    var daysDifferenceUTC = timeDifferenceUTC / (1000 * 60 * 60 * 24);

    var roundedDaysUTC = Math.round(daysDifferenceUTC);
    console.log("Rounded Days UTC:", roundedDaysUTC);
    return roundedDaysUTC;
  }

  async function getWordMeaning(word) {
    //try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();

    // Assuming the API response structure, you might need to adapt this based on the actual API response
    const wordDetails = data[0];
    const meanings = wordDetails.meanings;

    const modalContent = document.getElementById("modalContent");
    const card = createCard(word, meanings);
    modalContent.appendChild(card);

    return meanings;
    //} catch (error) {
    //  console.error("Error fetching word meaning:", error.message);
    //  return null; // Handle the error based on your application's logic
  }

  function createCard(word, meanings) {
    const card = document.createElement("div");
    card.className = "card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerHTML = `${word}`;
    cardBody.appendChild(title);

    meanings.forEach((meaning, index) => {
      const word_form = document.createElement("h5");
      word_form.className = "card-subtitle";
      word_form.innerHTML = `<br><small><i>${meaning.partOfSpeech}</i></small>`;
      cardBody.appendChild(word_form);

      const definition_list = document.createElement("ul");
      definition_list.className = "list-unstyled";

      meaning.definitions.forEach((meaning_sub, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${index + 1}.</strong> ${
          meaning_sub.definition
        }`;
        definition_list.appendChild(listItem);
      });

      cardBody.appendChild(definition_list);
    });

    card.appendChild(cardBody);

    return card;
  }

  // Function to simulate button click when corresponding key is pressed
  document.addEventListener("keydown", function (event) {
    // Get the pressed key
    const pressedKey = event.key.toUpperCase();

    // Find the button with the corresponding data-letter attribute
    var button = document.querySelector(
      `.keyboard-button[data-letter="${pressedKey}"]`,
    );

    // Handle Enter key
    if (event.key === "Enter") {
      button = document.getElementById("submitBtn");
    }

    // Handle Backspace key
    if (event.key === "Backspace") {
      button = document.getElementById("removeLetterBtn");
    }

    // If a button is found, simulate a click
    if (button) {
      button.click();
    }
  });

  document.getElementById("copyStats").addEventListener("click", function () {
    const copyStatsButton = document.getElementById("copyStats");
    var text_to_copy = copyStatsButton.dataset.stats.replace(/<br>/gi, "\n");

    console.log(text_to_copy);
    if (!navigator.clipboard) {
      displayMessage("Failed to copy.");
    } else {
      navigator.clipboard
        .writeText(text_to_copy)
        .then(function () {
          displayMessage("Copied to clipboard!"); // success
        })
        .catch(function () {
          displayMessage("Failed to copy."); // error
        });
    }
  });

  // Add a click event listener to each keyboard button
  document.querySelectorAll(".keyboard-button").forEach(function (button) {
    button.addEventListener("click", function () {
      if (pauseGame >= 2) {
        return;
      }
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
        updateGameData(3, letter);
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
      if (pauseGame >= 2) {
        return;
      }
      // Get the latest letter box in the current row
      var latestLetterBox = document.getElementById(
        "box" + currentRow + (currentBox - 1),
      );

      // Check if the box is not already empty
      if (latestLetterBox.innerHTML !== "") {
        // Remove the latest letter
        latestLetterBox.innerHTML = "";
        latestLetterBox.style.borderColor = "#c4c4c4";
        updateGameData(4, 0);

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

  // Fetch the word list and handle the submission logic
  fetch(wordListURL)
    .then((response) => response.text())
    .then(async (data) => {
      const wordArray = data.split("\n"); //.filter((word) => word.length === 5);
      console.log("array of words: " + JSON.stringify(wordArray.slice(0, 10)));
      if (game_mode == 0) {
        answer_index = getCurrentDay();
      } else {
        answer_index = Math.floor(Math.random() * wordArray.length);
      }

      answer = wordArray[answer_index].toLowerCase();

      document
        .getElementById("submitBtn")
        .addEventListener("click", function () {
          if (pauseGame >= 2) {
            return;
          }
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
              displayMessage(`${word} is not a valid English word.`);
              resetRow();
            }
          } else {
            displayMessage("Word must be 5 letters long.");
            // Add your logic for an invalid word length
          }
        });

      // Initialize the game (e.g., set up UI, display instructions)
      initializeGame();
      await sleep(600);
      if (pauseGame != 2) {
        pauseGame = 0;
        first_attempt = 1;
      }
    })
    .catch((error) => {
      console.error("Error reading the word list:", error);
    });

  document
    .getElementById("changeGameMode")
    .addEventListener("click", async function () {
      var toggleGameMode = document.getElementById("gameModeDropdown");
      var otherGameMode = document.getElementById("changeGameMode");
      otherGameMode.innerHTML = ["Daily", "Unlimited"][game_mode];
      game_mode = [1, 0][game_mode];
      toggleGameMode.innerHTML = ["Daily", "Unlimited"][game_mode];
      updateGameData(2, game_mode);
      location.reload();
    });

  document
    .getElementById("helpModalAnimation")
    .addEventListener("click", async function () {
      var boxes = document.querySelectorAll(".boxSpecial");

      for (var i = 0; i < boxes.length; i++) {
        var box = boxes[i];
        box.classList.remove("flipped", "flipped-back");
        box.classList.add("flipped");
        await sleep(0.5 * delay);
        box.classList.add("flipped-back");
      }
    });
});
