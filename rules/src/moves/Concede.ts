import GameState from '../GameState'
import GameView from '../GameView'
import TowerColor from '../material/TowerColor'
import MoveType from './MoveType'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: TowerColor
}

export function concede(state: GameState | GameView, move: Concede) {
  const player = state.players.find(player => player.tower === move.playerId)
  if (!player) return console.error(`Cannot find player with id ${move.playerId} to concede in ${state}`)
  player.eliminated = state.players.filter(player => player.eliminated).length + 1
}