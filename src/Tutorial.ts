import {tiles} from './tiles/Tiles'
import {shuffle} from '@gamepark/workshop'
import {setupPlayers} from './Rules'

const initialTiles = [ 0, 6, 9, 22, 20 ]

export function setupTutorial(){
  const startDeck = [...initialTiles, ...Array.from(tiles.keys()).filter(tile => !initialTiles.includes(tile))]
  const tileStart = startDeck.splice(0, 1)[0]
  const river = startDeck.splice(0, 4)
  const deck = shuffle(startDeck)
  const players = setupPlayers()
  return {
    players,
    deck,
    river,
    forest: [{tile: tileStart, x: 0, y: 0, rotation: 0}],
    activePlayer: players[0].tower,
    tutorial: true,
    over:false
  }
}

export function resetTutorial() {
  localStorage.removeItem('grandbois')
  window.location.reload()
}

export const tutorialMoves = [
  // Automatic Tutorial Draft Phase

]