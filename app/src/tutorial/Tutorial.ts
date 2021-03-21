import GameState from '@gamepark/grandbois/GameState'
import {setupPlayers} from '@gamepark/grandbois/Grandbois'
import {tiles} from '@gamepark/grandbois/material/Tiles'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import Move from '@gamepark/grandbois/moves/Move'
import {Tutorial} from '@gamepark/react-client'
import shuffle from 'lodash.shuffle'

const initialTiles = [0, 6, 9, 22, 20]

const GrandboisTutorial: Tutorial<GameState, Move, TowerColor> = {
  setupTutorial: () => {
    const startDeck = [...initialTiles, ...Array.from(tiles.keys()).filter(tile => !initialTiles.includes(tile))]
    const tileStart = startDeck.splice(0, 1)[0]
    const river = startDeck.splice(0, 4)
    const deck = shuffle(startDeck)
    const players = setupPlayers([{id: TowerColor.Blue}, {id: TowerColor.Black}])
    return [{
      players,
      deck,
      river,
      forest: [{tile: tileStart, x: 0, y: 0, rotation: 0}],
      activePlayer: players[0].tower,
      tutorial: true,
      over: false
    }, [TowerColor.Blue, TowerColor.Black]]
  },

  expectedMoves: () => [
    // Automatic Tutorial Draft Phase
  ]
}

export default GrandboisTutorial

export function resetTutorial() {
  localStorage.removeItem('grandbois')
  window.location.reload()
}
