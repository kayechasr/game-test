/**
 * @jest-environment jsdom
 */
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => { });

beforeAll(() => {
  let fs = require("fs");
  let fileContents = fs.readFileSync("index.html", "utf-8");
  document.open();
  document.write(fileContents);
  document.close();
});

describe("game object contains correct keys", () => {
  test("score key exist", () => {
    expect("score" in game).toBe(true);
  });
  test("currentGame key exist", () => {
    expect("currentGame" in game).toBe(true);
  });
  test("playerMoves key exist", () => {
    expect("playerMoves" in game).toBe(true);
  });
  test("choices key exist", () => {
    expect("choices" in game).toBe(true);
  });
  test("choices contains the correct ids", () => {
    expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
  });
  test("turnNumber key exists", () => {
    expect("turnNumber" in game).toBe(true);
  });
  test("chcek if lastButton exist in game object", () => {
    expect("lastButton" in game).toBe(true);
  });
  test("chcek if turnInProgress exist in game object", () => {
    expect("turnInProgress" in game).toBe(true);
  });
});

describe("newGame works correctly ", () => {
  beforeAll(() => {
    game.score = 42;
    game.playerMoves = ["button1, button2"];
    game.currentGame = ["button1, button2"];
    document.getElementById("score").innerText = "42";
    newGame();
  });

  test("should set new score to zero", () => {
    expect(game.score).toEqual(0);
  });
  test("playerMoves array should to be clear", () => {
    expect(game.playerMoves.length).toBe(0);
  });
  test("should be one element in the computer games array", () => {
    expect(game.currentGame.length).toBe(1);
  });

  test("should display zero for the element with id of score", () => {
    expect(document.getElementById("score").innerText).toEqual(0);
  });

  test("expect data-listener to be true", () => {
      const elements = document.getElementsByClassName("circle");
      for (let element of elements) {
        expect(element.getAttribute("data-listener")).toEqual("true");
      }
    });
});

describe("gamePlay works correctly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });

    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });

    test("should check if addTurn has two elements", () => {
        addTurn();
        expect(game.currentGame.length).toEqual(2);
    });

    test("should check if the correct class has been added to button to light it up", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });

    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });

    test("should increment the score if the turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });

    test("should call an alert if the move is wrong", () => {
        game.playerMoves.push("Wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong Move!");
    })
    test("should toggle turnInProgress to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });

    test("clicking during the computer sequence should fail", () => {
        showTurns();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    })
});
