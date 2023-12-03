# Wordle Game (Lookalike)

Welcome to the Wordle Game! This is a simple word-guessing game where players try to guess a hidden word by entering their guesses.

## How to Play

1. **Objective:** Guess the hidden word within a limited number of attempts.
2. **Word Display:** The hidden word is displayed as a series of boxes, and each box represents a letter in the word.
3. **Guessing:** Enter your guesses by selecting letters from the provided keyboard buttons.
4. **Feedback:** After each guess, you'll receive feedback on the correctness of your guessed letters.
   - Green: Correct letter in the correct position
   - Yellow: Correct letter in the wrong position
   - Grey: Incorrect letter

## Game Rules

- You have a limited number of attempts (rows) to guess the hidden word.
- The game ends when you correctly guess the word or exhaust all attempts.

## Modal Feedback

- After each game, a modal will display congratulating you and showing your game stats.
- Stats include the number of guesses, the correct and incorrect positions, and the arrangement of letters in each row.

## How to Run

Simply open the `index.html` file in a web browser to start playing the Wordle game.

## Technologies Used

- HTML
- CSS (Bootstrap 5)
- JavaScript (jQuery)

## File Structure

- `index.html`: Main HTML file with the game layout.
- `style.css`: CSS file for custom styling.
- `script.js`: JavaScript file for game logic.
- `words.txt`: Text file containing a list of English words.

## Acknowledgements

- Bootstrap: Used for styling components and modal.
- jQuery: Used for DOM manipulation and modal interactions.

## License

This project is licensed under the [MIT License](LICENSE).
