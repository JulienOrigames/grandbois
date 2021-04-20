import GameState from '@gamepark/grandbois/GameState'
import GameView from '@gamepark/grandbois/GameView'
import {changeActivePlayer} from '@gamepark/grandbois/moves/ChangeActivePlayer'
import {MoveView} from '@gamepark/grandbois/moves/Move'
import MoveType from '@gamepark/grandbois/moves/MoveType'
import {placeForestTile} from '@gamepark/grandbois/moves/PlaceForestTile'
import {placeTower} from '@gamepark/grandbois/moves/PlaceTower'
import {revealClansInView} from '@gamepark/grandbois/moves/RevealClans'
import {revealNewRiverTileInView} from '@gamepark/grandbois/moves/RevealNewRiverTile'
import {Game} from '@gamepark/rules-api'
import MoveForest, {MOVE_FOREST, moveForest} from './moves/MoveForest'

type LocalMove = MoveView | MoveForest

export default class GrandboisView implements Game<GameView, LocalMove> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  play(move: LocalMove) {
    switch (move.type) {
      case MoveType.PlaceForestTile:
        return placeForestTile(this.state, move)
      case MoveType.RevealNewRiverTile:
        return revealNewRiverTileInView(this.state, move)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state)
      case MoveType.PlaceTower:
        return placeTower(this.state)
      case MoveType.RevealClans:
        return revealClansInView(this.state, move)
      case MOVE_FOREST:
        return moveForest(this.state, move)
    }
  }
}

export function isGameView(game: GameState | GameView): game is GameView {
  return typeof game.deck === 'number'
}