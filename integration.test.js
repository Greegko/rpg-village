const { myContainer } = require('./dist/injection.config');
const gameController = myContainer.get('GameController');

const newState = gameController.gameTurn();

if(newState.general.turn !== 1) {
  console.log('Turn does not match!');
  console.log(newState);
} else {
  console.log('Integration is fine!');
}
