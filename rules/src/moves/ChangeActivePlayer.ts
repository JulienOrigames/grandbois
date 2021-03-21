import GameState from '../GameState'
import GameView from '../GameView'
import MoveType from './MoveType'

type ChangeActivePlayer = {
  type: typeof MoveType.ChangeActivePlayer
}

export default ChangeActivePlayer

export function changeActivePlayer(state: GameState | GameView) {
  delete state.tilePlayed
  const activePlayerIndex = state.players.findIndex(player => player.tower === state.activePlayer)
  const nextPlayerIndex = (activePlayerIndex + 1) % state.players.length
  state.activePlayer = state.players[nextPlayerIndex].tower
}