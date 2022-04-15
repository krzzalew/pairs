import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import Collapse from 'react-bootstrap/Collapse';
import Modal from 'react-bootstrap/Modal';
import './index.css';

// Create Options button and a toggleable game settings container.
function Options(props) {
  const [open, setOpen] = useState(false);
  const sizes = ['4x4', '4x6', '6x6', '6x8'];
  const sizeButtons = sizes.map((size) =>
    <button
      className={'selBtn' + (size === props.boardSize ? ' selected' : '')}
      onClick={props.selectSize}
      type='button'
      key={size}
      value={size}
    >
      {size}
    </button>
  );
  const themes = ['animals', 'food', 'vehicles', 'places'];
  const themeButtons = themes.map((theme) =>
    <button
      className={'selBtn' + (theme === props.cardTheme ? ' selected' : '')}
      type='button'
      onClick={props.selectTheme}
      key={theme}
      value={theme}
    >
      {theme}
    </button>
  );

  return (
    <>
      <button
        className='optBtn'
        onClick={() => setOpen(!open)}
        aria-controls="collapse"
        aria-expanded={open}
      >Options
      </button>
      <Collapse in={open}>
        <div id="collapse">
          <div className='row justify-content-around text-start p-2 mt-3 mx-auto options'>
            <div className='col-auto py-2'>
              <h5>Board size:</h5>
              <div className='btnGroup mb-2'>
                {sizeButtons}
              </div>
            </div>
            <div className='col-auto py-2'>
              <h5>Cards theme:</h5>
              <div className='btnGroup mb-2'>
                {themeButtons}
              </div>
            </div>
            <div className='col-auto py-2'>
              <div>
                <label>
                  <input
                    type="radio"
                    value='1' 
                    checked={props.players === '1'} 
                    onChange={props.switchOneTwo}
                  /> One player
                </label>
                <br />
                <input
                  type='text'
                  value={props.playerOne}
                  onChange={props.setPlayerOne}
                />
              </div>
              <div>
                <label className='mt-2 mb-1'>
                  <input
                    type="radio"
                    value='2' 
                    checked={props.players === '2'} 
                    onChange={props.switchOneTwo}
                  /> Two players
                </label>
                <br />
                <input
                  type='text'
                  disabled={props.players === '1'}
                  value={props.playerTwo}
                  onChange={props.setPlayerTwo}
                />
              </div>
              <label className='mt-2 mb-1'>
                <input
                  type="checkbox"
                  checked={props.hideGuessed}
                  onChange={props.toggleGuessed}
                /> Hide guessed cards
                </label>
            </div>
          </div>
        </div>
      </Collapse>
    </>
  );
}

// Render one or two score fields depending on number of players.
// Calculate and show results based on input properties from Game's state.
function Score(props) {
  const valid1 = props.playerOneStats.valid;
  const repeated1 = props.playerOneStats.repeated;
  const accuracy1 = valid1 === 0
    ? '-'
    : Math.round(valid1 / (valid1 + repeated1) * 100) + '%';

  const valid2 = props.playerTwoStats.valid;
  const repeated2 = props.playerTwoStats.repeated;
  const accuracy2 = valid2 === 0
    ? '-'
    : Math.round(valid2 / (valid2 + repeated2) * 100) + '%';

  return (
    <div>
      <div className={'score p-2' + (props.currentPlayer === '1' ? ' current' : '')}>
        <h4>{props.gameInput.playerOne}:</h4>
        <p>Points: {props.playerOneStats.points}</p>
        <p>Accuracy: {accuracy1}</p>
      </div>
      {props.gameInput.players > 1 &&
        <div className={'score p-2 mt-2' + (props.currentPlayer === '2' ? ' current' : '')}>
          <h4>{props.gameInput.playerTwo}:</h4>
          <p>Points: {props.playerTwoStats.points}</p>
          <p>Accuracy: {accuracy2}</p>
        </div>
      }
    </div>
  );
}

// Render cards area of proper size based on the props from Game component.
function Board(props) {
  const cards = props.cardNumbers.map((number) =>
    <div className={((props.numsGuessed.includes(number) && props.hideGuessed) ? ' guessed' : '')}
      onClick={() => props.handleClick(number)}
      key={number}
    >
      <div
        className={'cards ratio ratio-1x1'
        + ((props.currentChoice.includes(number) || props.numsGuessed.includes(number)) ? ' flipped' : '')}
      >
        <div className='front'>
          <img
            className={'img-fluid w-100'}
            src={'/images/tex.jpg'}
            alt='Card'
            draggable='false'
          />
        </div>
        <div className='back'>
          <img
            className={'img-fluid w-100'}
            src={'/images/' + props.gameInput.cardTheme + '/' + props.cardPictures[number] + '.jpg'}
            alt='Card'
            draggable='false'
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={'grid_' + props.gameInput.boardSize}>
      {cards}
    </div>
  );
}

// Display a modal window after completing the game.
function Results(props) {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.message}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={'/images/win.png'} alt='Trophy' height='360' width='640' className={'img-fluid'} />
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='startBtn'
            onClick={props.startNew}
          >Play again
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// The main component. Provides methods to handle changes in the game.
// Stores the state of the game and player's preferences.
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: '4x4',
      cardTheme: 'animals',
      players: '1',
      playerOne: 'Player 1',
      playerTwo: 'Player 2',
      hideGuessed: true,
      started: false,
      finished: false,
    };
    this.startNew = this.startNew.bind(this);
    this.selectSize = this.selectSize.bind(this);
    this.selectTheme = this.selectTheme.bind(this);
    this.switchOneTwo = this.switchOneTwo.bind(this);
    this.setPlayerOne = this.setPlayerOne.bind(this);
    this.setPlayerTwo = this.setPlayerTwo.bind(this);
    this.toggleGuessed = this.toggleGuessed.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  startNew() {
    const count = this.state.boardSize[0] * this.state.boardSize[2];
    const numbers = Array.from(Array(count).keys());
    const pictures = randomPairs(count);
    this.setState(state => ({
      started: true,
      finished: false,
      gameInput: {
        boardSize: state.boardSize,
        cardTheme: state.cardTheme,
        players: state.players,
        playerOne: state.playerOne,
        playerTwo: state.playerTwo
      },
      cardNumbers: numbers,
      cardPictures: pictures,
      numsRevealed: [],
      numsGuessed: [],
      currentPlayer: '1',
      playerOneStats: {
        valid: 0,
        repeated: 0,
        points: 0
      },
      playerTwoStats: {
        valid: 0,
        repeated: 0,
        points: 0
      },
      currentChoice: []
    }));
  }

  selectSize(event) {
    this.setState({
      boardSize: event.target.value
    });
  }

  selectTheme(event) {
    this.setState({
      cardTheme: event.target.value
    });
  }

  switchOneTwo(event) {
    this.setState({
      players: event.target.value
    });
  }

  setPlayerOne(event) {
    this.setState({
      playerOne: event.target.value
    });
  }

  setPlayerTwo(event) {
    this.setState({
      playerTwo: event.target.value
    });
  }

  toggleGuessed() {
    this.setState(state => ({
      hideGuessed: ! state.hideGuessed,
    }));
  }

  handleClick(i) {
    if (this.state.currentChoice.includes(i) || this.state.numsGuessed.includes(i)) {
      return;
    }

    const newChoice = this.state.currentChoice.length < 2
      ? this.state.currentChoice.slice()
      : [];
    newChoice.push(i)
    if (newChoice.length < 2) {
      this.setState({
        currentChoice: newChoice
      });
      return;
    }

    let valid, repeated, points;
    if (this.state.currentPlayer === '1') {
      valid = this.state.playerOneStats.valid;
      repeated = this.state.playerOneStats.repeated;
      points = this.state.playerOneStats.points;
    } else {
      valid = this.state.playerTwoStats.valid;
      repeated = this.state.playerTwoStats.repeated;
      points = this.state.playerTwoStats.points;
    }

    let num1, num2;
    [num1, num2] = newChoice;
    if (this.state.cardPictures[num1] === this.state.cardPictures[num2]) {
      const newGuessed = this.state.numsGuessed.slice();
      newGuessed.push(num1, num2);
      valid += 2;
      points += 1;
      switch(this.state.currentPlayer) {
        case '1':
          this.setState({
            numsGuessed: newGuessed,
            playerOneStats: {
              valid: valid,
              repeated: repeated,
              points: points
            },
            currentChoice: newChoice
          });
          break;
        case '2':
          this.setState({
            numsGuessed: newGuessed,
            playerTwoStats: {
              valid: valid,
              repeated: repeated,
              points: points
            },
            currentChoice: newChoice
          });
          break;
        default:
          break;
      }
      if (this.state.cardNumbers.length === newGuessed.length) {
        this.setState({
          finished: true,
        }, () => {
          const message = this.winnerMessage();
          this.setState({
            message: message
          })
        });
      }
    } else {
      const newRevealed = this.state.numsRevealed.slice();
      for (let num of [num1, num2]) {
        if (this.state.numsRevealed.includes(num)) {
          repeated += 1;
        } else {
          valid +=1;
          newRevealed.push(num)
        }
      }
      switch(this.state.currentPlayer) {
        case '1':
          this.setState({
            numsRevealed: newRevealed,
            playerOneStats: {
              valid: valid,
              repeated: repeated,
              points: points
            },
            currentChoice: newChoice
          });
          break;
        case '2':
          this.setState({
            numsRevealed: newRevealed,
            playerTwoStats: {
              valid: valid,
              repeated: repeated,
              points: points
            },
            currentChoice: newChoice
          });
          break;
        default:
          break;
      }
      if (this.state.gameInput.players === '2') {
        this.setState(state => ({
          currentPlayer: state.currentPlayer === '1' ? '2' : '1'
        }));
      }
    }
  }

  winnerMessage() {
    let messages;
    if (this.state.gameInput.players === '1') {
      messages = ['You won!', 'Good job!', 'Congratulations!', 'Well done!'];
    } else if (this.state.playerOneStats.points === this.state.playerTwoStats.points) {
      messages = ['There is a tie.', 'It\'s a draw.'];
    } else {
      const winner = (this.state.playerOneStats.points > this.state.playerTwoStats.points)
        ? this.state.gameInput.playerOne
        : this.state.gameInput.playerTwo;
      messages = [`${winner} wins!`, `${winner} was better this time!`, `The winner is ${winner}!`]
    }
    const message = messages[Math.floor(Math.random() * messages.length)];
    return message;  
  }

  render() {
    return (
      <div className='d-flex flex-column min-vh-100'>
        <h1 className='text-center my-3'>Pairs Game</h1>
        <div className='container text-center p-0'>
          <button
            type='button'
            className='startBtn'
            onClick={this.startNew}
          >Start New Game
          </button>
          <Options
            boardSize={this.state.boardSize}
            cardTheme={this.state.cardTheme}
            players={this.state.players}
            playerOne={this.state.playerOne}
            playerTwo={this.state.playerTwo}
            hideGuessed={this.state.hideGuessed}
            selectSize={this.selectSize}
            selectTheme={this.selectTheme}
            switchOneTwo={this.switchOneTwo}
            setPlayerOne={this.setPlayerOne}
            setPlayerTwo={this.setPlayerTwo}
            toggleGuessed={this.toggleGuessed}
          />
        </div>
        {this.state.started &&
          <>
            <div className='container my-3 p-0'>
              <div className='row p-2 mx-auto panel'>
                <div className='col-md-3 p-2'>
                  <Score
                    gameInput={this.state.gameInput}
                    currentPlayer={this.state.currentPlayer}
                    playerOneStats={this.state.playerOneStats}
                    playerTwoStats={this.state.playerTwoStats}
                  />
                </div>
                <div className='col-md-9 p-2'>
                  <Board
                    gameInput={this.state.gameInput}
                    cardNumbers={this.state.cardNumbers}
                    cardPictures={this.state.cardPictures}
                    currentChoice={this.state.currentChoice}
                    numsGuessed={this.state.numsGuessed}
                    hideGuessed={this.state.hideGuessed}
                    handleClick={this.handleClick}
                  />
                </div>
              </div>
            </div>
            {this.state.finished &&
              <Results
                message={this.state.message}
                startNew={this.startNew}
              />
            }
          </>
        }
        <footer className='footer mt-auto py-2 container-fluid text-center'>
          <span>
            &copy; {new Date().getFullYear()} <a href="https://github.com/krzzalew/pairs">Krzysztof Zalewski</a>
          </span>
        </footer>
      </div>
    );
  }
};

// Draws a random array of card numbers from 0 to 23 to match the 'count' length.
// The chosen numbers occur twice and are randomly ordered.
function randomPairs(count) {
  const start = Math.floor(Math.random() * 24);
  const numbers = [];
  for (let i = 0; i < (count / 2); i++) {
    start + i < 24
    ? numbers.push(start + i)
    : numbers.push(start + i - 24);
  }
  const doubled = numbers.concat(numbers);
  const shuffled = doubled.sort((a, b) => 0.5 - Math.random());
  return shuffled;
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);