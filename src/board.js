import React from 'react';
import './App.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    getDisplay(idx) {
        const val = this.props.gameStatus[idx];
        if (val === "none") {
            return " ";
        }

        return val === "player1" ? "O" : "X";
    }

    _onClickGrid(e, idx) {
        this.props.onClick(e, idx);
    }

    render() {
        return (
            <div className="Board">
                <div className="BoardRow">
                    <label id="grid_0" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 0)}>{this.getDisplay(0)}</label>
                    <label id="grid_1" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 1)}>{this.getDisplay(1)}</label>
                    <label id="grid_2" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 2)}>{this.getDisplay(2)}</label>
                </div>
                <div className="BoardRow">
                    <label id="grid_3" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 3)}>{this.getDisplay(3)}</label>
                    <label id="grid_4" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 4)}>{this.getDisplay(4)}</label>
                    <label id="grid_5" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 5)}>{this.getDisplay(5)}</label>
                </div>
                <div className="BoardRow">
                    <label id="grid_6" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 6)}>{this.getDisplay(6)}</label>
                    <label id="grid_7" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 7)}>{this.getDisplay(7)}</label>
                    <label id="grid_8" className="BoardGrid" onClick={(e, idx) => this._onClickGrid(e, 8)}>{this.getDisplay(8)}</label>
                </div>
            </div>
        );
    }
};

export default Board;