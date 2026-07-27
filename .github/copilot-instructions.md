# GitHub Copilot Instructions

## Project Overview

This project is a Flask-based Sudoku game.
The goal is to refactor legacy code into a clean,
modern, maintainable application.

## Coding Standards

- Use clean Python 3 practices.
- Write readable and modular code.
- Use meaningful variable and function names.
- Add comments for complex logic.
- Follow PEP8 style guidelines.

## Flask Structure

Organize the application into:

- routes
- game logic
- templates
- static files
- utility functions

Avoid putting all logic inside app.py.

## Sudoku Requirements

The application must:

- Generate valid Sudoku puzzles.
- Have exactly one solution.
- Support Easy, Medium, Hard difficulty.
- Lock pre-filled cells.
- Validate user input.
- Provide hints.
- Track completion time.

## Frontend Requirements

The UI should:

- Support desktop and mobile screens.
- Support light and dark mode.
- Have accessible buttons.
- Use clear visual feedback.
- Use alternating 3x3 Sudoku box colors.

## Testing

Before modifying features:

- Create tests first.
- Run tests after changes.
- Do not remove existing functionality.

## Copilot Usage

When suggesting code:

- Explain important changes.
- Prefer maintainable solutions.
- Avoid unnecessary complexity.