import app as app_module


def test_index_page_loads(client):
    response = client.get("/")

    assert response.status_code == 200
    assert b"Sudoku Game" in response.data


def test_new_route_returns_a_puzzle(client):
    response = client.get("/new?clues=35")

    assert response.status_code == 200
    payload = response.get_json()
    assert "puzzle" in payload

    puzzle = payload["puzzle"]
    assert isinstance(puzzle, list)
    assert len(puzzle) == 9
    assert all(isinstance(row, list) and len(row) == 9 for row in puzzle)


def test_check_solution_reports_incorrect_cells(client):
    client.get("/new?clues=35")
    solution = app_module.CURRENT["solution"]

    board = [row[:] for row in solution]
    board[0][0] = 1 if solution[0][0] != 1 else 2

    response = client.post(
        "/check",
        json={"board": board},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert "incorrect" in payload
    assert [0, 0] in payload["incorrect"]


def test_hint_route_returns_a_valid_hint(client):
    client.get("/new?clues=35")
    solution = app_module.CURRENT["solution"]

    board = [row[:] for row in solution]
    board[0][0] = 0

    response = client.post(
        "/hint",
        json={"board": board},
    )

    assert response.status_code == 200
    payload = response.get_json()
    assert "hint" in payload
    hint = payload["hint"]
    assert all(key in hint for key in ["row", "col", "value"])
    assert 0 <= hint["row"] < 9
    assert 0 <= hint["col"] < 9
    assert hint["value"] == solution[hint["row"]][hint["col"]]
