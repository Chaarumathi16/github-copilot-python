import sudoku_logic


def test_create_empty_board_returns_9x9_grid_of_zeroes():
    board = sudoku_logic.create_empty_board()

    assert len(board) == sudoku_logic.SIZE
    assert all(len(row) == sudoku_logic.SIZE for row in board)
    assert all(cell == sudoku_logic.EMPTY for row in board for cell in row)


def test_generate_puzzle_returns_puzzle_and_solution_with_expected_clues():
    puzzle, solution = sudoku_logic.generate_puzzle(clues=35)

    assert len(puzzle) == sudoku_logic.SIZE
    assert len(solution) == sudoku_logic.SIZE
    assert sum(cell != sudoku_logic.EMPTY for row in puzzle for cell in row) == 35
    assert puzzle != solution


def test_count_solutions_reports_unique_solution():
    puzzle, solution = sudoku_logic.generate_puzzle(clues=35)

    board = [row[:] for row in puzzle]
    assert sudoku_logic.count_solutions(board, max_solutions=2) == 1

    completed = [row[:] for row in solution]
    assert sudoku_logic.count_solutions(completed, max_solutions=2) == 1
