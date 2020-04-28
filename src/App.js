import React, { Component } from 'react';
import ControlPanel from './components/ControlPanel.jsx';
import Header from './components/Header.jsx';
import Playground from './components/Playground.jsx';
import FoodIcon from './img/apple.png';
import EatingSound from './audio/eatingSound.mp3';
import GameOverSound from './audio/gameOver.wav';
import './Interface.css';
import './Snake.css';

class App extends Component {
  constructor() {
    super();
    this.counterId = ''
    this.box = 20
    this.defaultSnakeDirection = 'right'
    this.snakeColor = [
      '#A8A8A8',
      '#989898',
      '#808080',
      '#606060',
      '#383838',
    ]
    this.state = {
      left: 0,
      top: 0,
      position: 'relative',
      snakeCanvasObj: null,
      currentDirection: '',
      speedFactor: 7,
      score: 0,
      defaultSnakeCoordinate: [],
      snakeCanvas: {width:this.box*this.box, height: this.box*this.box},
      foodCoordinate: {x: this.generateRandom() - this.box, y: this.generateRandom() - this.box},
      scoreAdd: 10,
      message: 'Hit Play Button to start..',
      isGameOver: false
    }
  }

  /* Fuction defined to initialize the snake components after sucessfully mounting to actual DOM */
  componentDidMount = () => {
    this.initSnakeGame();
  }

  /* Fuction defined to set the default coordinates of the snake in canvas*/
  setDefaultSnakeCoordinates = () => {
    return [
      {x: 7*this.box, y: 2*this.box, color: '#A8A8A8'},
      {x: 6*this.box, y: 2*this.box, color: '#989898'},
      {x: 5*this.box, y: 2*this.box, color: '#808080'},
      {x: 4*this.box, y: 2*this.box, color: '#606060'},
      {x: 3*this.box, y: 2*this.box, color: '#383838'}
    ];
  }

  /* Fuction defined to initialize the snake components */
  initSnakeGame = () => {
    let snakeCanvasObject = document.getElementById("snk-canvas");
    let snakeCanvas = snakeCanvasObject.getContext("2d"); // get canvas object
    this.setState(
      {
        snakeCanvasObj: snakeCanvas,
        defaultSnakeCoordinate: this.setDefaultSnakeCoordinates(),
        currentDirection: this.defaultSnakeDirection,
        score: 0
      }, () => {
        this.drawSnake(snakeCanvas);
      }
    );
  }

  /* Fuction defined to create the food if snake has eaten the previous one */
  createFood = () => {
    let snakeCordinateArray = this.state.defaultSnakeCoordinate;
    let newLengthCoordinates;
    snakeCordinateArray.forEach((snakeCurrentCoordinate) => {
        if (snakeCurrentCoordinate.x == this.state.foodCoordinate.x && snakeCurrentCoordinate.y == this.state.foodCoordinate.y) {
          this.playEatingSound();
          newLengthCoordinates = this.processSnakeAccordingToDirection(snakeCordinateArray, this.state);
          snakeCordinateArray.unshift(newLengthCoordinates);
          this.setState((preState) => {
            return {
              foodCoordinate: {x: this.generateRandom() - this.box, y: this.generateRandom() - this.box},
              defaultSnakeCoordinate: snakeCordinateArray,
              score: preState.score + preState.scoreAdd
            }
          });
        }
    });
  }

  /* Fuction defined to play eating sound once snake eats food */
  playEatingSound = () => {
    let audio = new Audio(EatingSound);
    audio.play();
  }

  /* Fuction defined to play Game Over sound once snake touches the boundaries */
  playGameOverSound = () => {
    let audio = new Audio(GameOverSound);
    audio.play();
  }

  /* Fuction defined to draw the food on canvas */
  drawFood = () => {
    let snakeCanvasObj = this.state.snakeCanvasObj;
    snakeCanvasObj.fillStyle = 'white';
    let foodImageElement = document.getElementById('foodImage');
    snakeCanvasObj.drawImage(foodImageElement, this.state.foodCoordinate.x, this.state.foodCoordinate.y, this.box, this.box);
  }

  /* Fuction defined to get the random numbers to generate food on random coordinates  */
  generateRandom = () => {
    return Math.floor(Math.random() * 20 + 1)*this.box;
  }

  /* Fuction defined to draw the snake on canvas */
  drawSnake = (snakeCanvas) => {
    let snakeCordinateArray = this.state.defaultSnakeCoordinate;
    snakeCordinateArray.forEach((snake) => {
      snakeCanvas.fillStyle = snake.color;
      snakeCanvas.strokestyle = 'black'
      snakeCanvas.fillRect(snake.x, snake.y, this.box, this.box);
      snakeCanvas.strokeRect(snake.x, snake.y, this.box, this.box);
    });
  }

  /* Fuction defined to detect the key press and set the direction in state */
  handleArrowKeys = (event) => {
    event.preventDefault();
    let key = 'which' in event ? event.which : event.keyCode;
    let snakeObjClone;
    switch (key) {
      case 37: //left
        this.setState((state) => {
          return {
            currentDirection: 'left'
          }
        });
        break;
      case 38: //up
        this.setState((state) => {
          return {
            currentDirection: 'up'
          }
        });
        break;
      case 39: //right
        this.setState((state) => {
          return {
            currentDirection: 'right'
          }
        });
        break;
      case 40: //down
        this.setState((state) => {
          return {
            currentDirection: 'down'
          }
        });
        break;
    }
  }

  /* Fuction defined to start the movement of snake once clicking on Play button */
  handlePlay = () => {
    this.setState((state) => {
      return {
        message: `Here we go....`,
        isGameOver: false
      }
    });
    setTimeout(() => {
      this.setState((state) => {
        if (!this.state.isGameOver && this.state.score > 30) {
          return {
            message: `You are playing well....`
          }
        }
      });
    }, 5000);
    this.counterId = setInterval(this.moveTheSnake, 1000/this.state.speedFactor);
  }

  /* Fuction defined to stop the movement of snake once clicking on Pause button */
  handleStop = () => {
    if (this.counterId != '') {
      clearInterval(this.counterId);
    } else {
      alert('Game not started yet');
    }
  }

  /* Fuction defined to start the movement of snake once clicking on Play button */
  moveTheSnake = () => {
    this.setState((state) => {
      const directionData = this.getDirectionData(state);
      return {
          [directionData.directionType]: directionData.directionMove,
          defaultSnakeCoordinate: directionData.snakeCordinateArray
      }
    });
    this.clearCanvas();
    this.createFood();
    this.drawFood();
    this.drawSnake(this.state.snakeCanvasObj);
    if (this.checkIfGameOver()) {
      this.processGameEnd();
      return false;
    }
  }

  /* Fuction defined to process the Game end */
  processGameEnd = () => {
    this.playGameOverSound();
    //stop the snake movement
    this.handleStop();
    //clear the canvas
    this.clearCanvas();
    //initialize the snake component to start again
    this.initSnakeGame();
    //set game over message
    this.setGameOverMessage();
  }

  setGameOverMessage = () => {
    let snakeCanvasObj = this.state.snakeCanvasObj;
    snakeCanvasObj.font = "50px normal";
    snakeCanvasObj.fillStyle = "#ffff";
    snakeCanvasObj.fillText('GAME OVER', 60, 200);
  }

  /* Fuction defined to end the game once it collides with itself or boundaries */
  checkIfGameOver = () => {
    let snakeCordinateArray = this.state.defaultSnakeCoordinate;
    snakeCordinateArray.forEach((snake) => {
      let index = snakeCordinateArray.indexOf(snake);
      if (index != 0 && snakeCordinateArray[0].x == snake.x && snakeCordinateArray[0].y == snake.y) {
        return true;
      }
    });

    if (snakeCordinateArray[0].x < 0
      || snakeCordinateArray[0].y > this.state.snakeCanvas.height - this.box
      || snakeCordinateArray[0].y < 0
      || snakeCordinateArray[0].x > this.state.snakeCanvas.width  - this.box
      ) {
      return true;
    }
    return false;
  }

  handleRestart = () => {
    this.initSnakeGame();
  }

  /* Fuction defined to move the snake left, right, up & down */
  processSnakeAccordingToDirection = (snakeCordinateArray, state) => {
    if (state.currentDirection == 'left' && state.currentDirection != 'right') return {x: snakeCordinateArray[0].x - this.box, y:snakeCordinateArray[0].y};
    else if (state.currentDirection == 'right' && state.currentDirection != 'left') return {x: snakeCordinateArray[0].x + this.box, y:snakeCordinateArray[0].y};
    else if (state.currentDirection == 'up' && state.currentDirection != 'down') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y - this.box};
    else if (state.currentDirection == 'down' && state.currentDirection != 'up') return {x: snakeCordinateArray[0].x, y:snakeCordinateArray[0].y + this.box};
  }

  /* Fuction defined to get the direction data to set in the current state*/
  getDirectionData = (state) => {
    let directionMove, directionType, head;
    let snakeCordinateArray = this.state.defaultSnakeCoordinate;
    let snakeCanvas = this.state.snakeCanvasObj;
    if (state.currentDirection == 'left' || state.currentDirection == 'right') directionType = 'left';
    else if (state.currentDirection == 'up' || state.currentDirection == 'down') directionType = 'top';
    head = this.processSnakeAccordingToDirection(snakeCordinateArray, state);
    snakeCordinateArray.unshift(head);
    snakeCordinateArray.pop();
    snakeCordinateArray.forEach((snake) => {
      let index = snakeCordinateArray.indexOf(snake);
      snake.color = this.snakeColor[index];
    });
    return {
      directionType,
      directionMove,
      snakeCordinateArray
    };
  }

  clearCanvas = () => {
    let snakeCanvasObject = document.getElementById("snk-canvas");
    let snakeCanvas = snakeCanvasObject.getContext("2d");
    snakeCanvas.clearRect(0, 0, this.state.snakeCanvas.width, this.state.snakeCanvas.height);
  }

  render() {
    return (
      <div className="main-container">
        <div className="container">
          <Header />
          <ControlPanel
            snakeControl={this.state}
            onPlay={this.handlePlay}
            onPause={this.handleStop}
            onRestart={this.handleRestart}
            onKeyPress={(e) => this.handleArrowKeys(e)}
          />
          <img id="foodImage" width={this.box} height={this.box} src={FoodIcon} style={{display:'none'}} />
          <Playground snakeControl={this.state} />
        </div>
      </div>
    );
  }
}

export default App;
