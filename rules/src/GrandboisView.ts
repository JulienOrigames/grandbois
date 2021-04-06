import {Game} from '@gamepark/rules-api'
import GameState from './GameState'
import GameView from './GameView'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {placeForestTile} from './moves/PlaceForestTile'
import {placeTower} from './moves/PlaceTower'
import {revealClansInView} from './moves/RevealClans'
import {revealNewRiverTileInView} from './moves/RevealNewRiverTile'

export default class GrandboisView implements Game<GameView, MoveView> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  play(move: MoveView) {
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
    }
  }
}

export function isGameView(game: GameState | GameView): game is GameView {
  return typeof game.deck === 'number'
}