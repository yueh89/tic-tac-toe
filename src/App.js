import React from 'react';
import './App.css';
import Board from './board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "inProg", // "notStarted", "inProg"
      // winner: "none", // "none", "player1", "player2", "draw"
      turn: "player1", // "none", "player1", "player2"
      history: [], // list of {player: 1 or 2, step: 0 to 8}
      historyCursor: 0,
      leaderboard: {
        player1: 0,
        player2: 0
      },
      board: new Array(9).fill("none"), // "none", "player1", "player2"
      context: "Player 1 (\"O\")'s turn!"
    };
  }

  computeGameStatus(b, player, move) {
    if (
      (b[0] === b[1] && b[1] === b[2] && b[2] !== "none") ||
      (b[3] === b[4] && b[4] === b[5] && b[5] !== "none") ||
      (b[6] === b[7] && b[7] === b[8] && b[8] !== "none") ||
      (b[0] === b[3] && b[3] === b[6] && b[6] !== "none") ||
      (b[1] === b[4] && b[4] === b[7] && b[7] !== "none") ||
      (b[2] === b[5] && b[5] === b[8] && b[8] !== "none") ||
      (b[0] === b[4] && b[4] === b[8] && b[8] !== "none") ||
      (b[2] === b[4] && b[4] === b[6] && b[6] !== "none")
    ) {
      const p1 = this.state.leaderboard.player1 + (player === "player1" ? 1 : 0);
      const p2 = this.state.leaderboard.player2 + (player === "player2" ? 1 : 0);
      this.setState({
        status: "notStarted", // "notStarted", "inProg"
        // winner: player, // "none", "player1", "player2", "draw"
        context: player === "player1" ? "Player 1 (\"O\") won!" : "Player 2 (\"X\") won!",
        leaderboard: {
          player1: p1,
          player2: p2
        }
      });
    } else if (b.every(v => v !== "none")) {
      this.setState({
        status: "notStarted", // "notStarted", "inProg"
        // winner: "draw", // "none", "player1", "player2", "draw"
        context: "Draw!"  
      });
    } else {
      this.setState(prevState => {
        const turn = prevState.turn === "player1" ? "player2" : "player1";
        return {
          turn: turn,
          context: turn === "player1" ? "Player 1 (\"O\")'s turn!" : "Player 2 (\"X\")'s turn!"
        }
      });
    }
  }

  _onClickBoard(e, idx) {
    if (this.state.status === "notStarted") {
      return;
    }

    if (this.state.board[idx] !== "none") {
      return;
    }
    const b = this.state.board;
    const p = this.state.turn;
    const hc = this.state.historyCursor;
    const histOri = this.state.history;
    const hist = histOri.slice(0, hc);
    const histToDiscard = histOri.slice(hc);
    hist.push({[p]: idx});
    histToDiscard.forEach(val => {
      if ("player1" in val) {
        b[val.player1] = "none";
      } else {
        b[val.player2] = "none";
      }
    });
    b[idx] = p;
    this.setState({board: b, history: hist, historyCursor: hc+1});
    this.computeGameStatus(b, p, idx);
  }

  _onClickStartANewGame = () => {
    this.setState({
      status: "inProg",
      // winner: "none",
      turn: "player1",
      history: [],
      historyCursor: 0,
      board: ["none", "none", "none", "none", "none", "none", "none", "none", "none"],
      context: "Player 1 (\"O\")'s turn!"
    });
  }

  _onClickGoBack = () => {
    this.setState(
      prevState => {
        const hc = prevState.historyCursor;
        const histStep = prevState.history[hc-1];
        const p = ("player1" in histStep ? "player1" : "player2");
        const idx = ("player1" in histStep ? histStep.player1 : histStep.player2);
        const b = prevState.board;
        b[idx] = "none";
        // turn, board, cursor, context
        return {
          turn: p,
          board: b,
          historyCursor: hc-1,
          context: p === "player1" ? "Player 1 (\"O\")'s turn!" : "Player 2 (\"X\")'s turn!"
        };
      }
    );
  }

  _onClickGoForward = () => {
    this.setState(
      prevState => {
        const hc = prevState.historyCursor;
        const histStep = prevState.history[hc];
        const p = ("player1" in histStep ? "player1" : "player2");
        const idx = ("player1" in histStep ? histStep.player1 : histStep.player2);
        const b = prevState.board;
        b[idx] = p;
        // turn, board, cursor, context
        return {
          turn: p === "player1" ? "player2" : "player1",
          board: b,
          historyCursor: hc+1,
          context: p === "player1" ? "Player 2 (\"X\")'s turn!" : "Player 1 (\"O\")'s turn!"
        };
      }
    );
  }

  _onClickResetLeaderboard = () => {
    this.setState({leaderboard: {player1: 0, player2: 0}});
  }

  _showLeaderboard = () => {
    const p1 = this.state.leaderboard.player1;
    const p2 = this.state.leaderboard.player2;
    const t = <div>Leaderboard</div>;
    if (p1 >= p2) {
      return <div>{t}<div>Player 1: {p1}</div><div>Player 2: {p2}</div></div>;
    }

    return <div>{t}<div>Player 2: {p2}</div><div>Player 1: {p1}</div></div>;
  }

  _showHistory = () => {
    if (this.state.historyCursor === 0) {
      return null;
    }

    const title = <div>History of the Current Game:</div>;
    const lines = this.state.history.map(
      obj => {
        const p = ("player1" in obj ? "Player 1" : "Player 2");
        const k = ("player1" in obj ? "player1" : "player2");
        const r = Math.floor(obj[k] / 3) + 1;
        const c = Math.floor(obj[k] % 3) + 1;
        return <div key={(r-1)*3+c-1}>{p + " has taken (" + r + ", " + c + ")."}</div>;
      }
    )
    return <div>{title}{lines.slice(0, this.state.historyCursor)}</div>;
  }

  render() {
    return (
      <div className="App">
        <Board onClick={(e, idx) => this._onClickBoard(e, idx)} gameStatus={this.state.board} />
        <div>{this.state.context}</div>
        <div>
          <button onClick={this._onClickStartANewGame}>Start a New Game</button>
          <button 
            onClick={this._onClickGoBack} 
            disabled={this.state.status !== "inProg" || this.state.historyCursor <= 0}
            >Go Back
          </button>
          <button 
            onClick={this._onClickGoForward} 
            disabled={
              this.state.status !== "inProg" || 
              this.state.history.length <= this.state.historyCursor
            }
            >Go Forward
          </button>
          <button 
            onClick={this._onClickResetLeaderboard}
            disabled={this.state.status !== "notStarted"}
            >Reset Leaderboard
          </button>
        </div>
        <div>
          {this._showLeaderboard()}
        </div>
        <div>
          {this._showHistory()}
        </div>
      </div>
    );
  }
}

export default App;

/*
  _sumWithExplicitCall(x) { 
    // e.g., _sumWithExplicitCall(3)(5)(6)(). Result is 14
    let sum = x;
    return function result(y) {
      if (arguments.length) {
        sum += y;
        return result;
      }
      return sum;
    }
  }

  _sumWithoutExplicitCall(x) {
    // e.g. _sumWithoutExplicitCall(7)(6)(9).valueOf()
    let sum = x;
    function resultFn(y){
        sum += y;
        return resultFn;
    }
    resultFn.valueOf = function(){
            return sum;
        };
    return resultFn;
  }

  _sumWithoutExplicitCall2(x){
    let sum = x;
    return function resultFn(y){
        sum += y;
        resultFn.res = sum;
        return resultFn;
    }
  }

  _onMouseOver = () => {
    this.setState(prevState => ({sum: prevState.sum + 1}));
  }

*/