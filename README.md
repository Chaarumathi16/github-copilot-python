# Refactor a Sudoku Game written in Python Flask

Use this simple Sudoku game as a starting point to practice your skills with GitHub Copilot. The goal is to refactor the code to use modern technologies while also adding new features and improving the overall user experience.

---

# Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

## Dependencies

- Modern web browser (Chrome, Firefox, Edge, etc.)
- Python 3

---

## Installation

1. Fork this repository to your GitHub account.

2. Clone your forked repository to your local machine.

3. Open a terminal window and navigate to the `github-copilot-python/starter` directory.

4. Create a Python virtual environment and activate it (optional but highly recommended).

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

5. Install the required Python packages.

```bash
pip install -r requirements.txt
```

---

## Running the Application

Navigate to the `starter` directory and start the Flask application.

```bash
cd starter
python app.py
```

Open your browser and visit:

```
http://127.0.0.1:5000
```

---

## Running the Tests

To verify that the application works correctly, run the automated test suite from the project root directory.

```bash
python -m pytest
```

Expected output:

```text
============================= test session starts =============================
...
7 passed
============================= 7 passed in 0.xx s =============================
```

Run the tests after each refactor or feature update to ensure existing functionality continues to work correctly.

---

# Project Instructions

GitHub Copilot was used throughout the project to refactor the legacy Sudoku application and implement new functionality.

The completed application includes:

- A refactored Python Flask application with improved code organization.
- A Sudoku generator that creates puzzles with a unique solution.
- Difficulty selector with Easy, Medium, and Hard modes.
- Locked pre-filled cells.
- Immediate feedback for invalid entries.
- Puzzle completion detection with a congratulatory message.
- Timer to track solving time.
- Hint button that fills one correct cell and locks it.
- Check Puzzle button to validate the current board.
- Top 10 leaderboard stored in browser Local Storage.
- Dark Mode toggle.
- Responsive layout for desktop and mobile devices.
- Alternating colors for the 3×3 Sudoku boxes.
- Accessible UI with readable controls in both light and dark modes.

---

## GitHub Copilot Usage

GitHub Copilot was used to assist with:

- Setting up the testing framework.
- Refactoring the legacy codebase.
- Implementing unique-solution Sudoku generation.
- Adding the difficulty selector.
- Implementing the timer, hint system, and puzzle checker.
- Building the Top 10 leaderboard using Local Storage.
- Improving styling, responsiveness, dark mode, and accessibility.

Screenshots of Copilot interactions for each milestone are included in the `Screenshots` folder.

---

## Features

- Unique-solution Sudoku puzzle generator
- Difficulty levels (Easy, Medium, Hard)
- Live input validation
- Hint button
- Check Puzzle button
- Timer
- Dark Mode
- Responsive design
- Top 10 leaderboard saved using Local Storage
- Mobile-friendly layout
- Accessible color scheme
- Congratulations message when the puzzle is solved