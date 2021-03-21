import GameState from '../GameState'
import GameView from '../GameView'
import Clan from '../material/Clan'
import TowerColor from '../material/TowerColor'
import Player from '../Player'
import MoveType from './MoveType'

type RevealClans = { type: typeof MoveType.RevealClans }

export default RevealClans

export type RevealClansView = RevealClans
  & { clans: { [key in TowerColor]?: Clan[] } }

export function isRevealClansView(move: RevealClans | RevealClansView): move is RevealClansView {
  return (move as RevealClansView).clans !== undefined
}

export function revealClans(state: GameState | GameView) {
  state.over = true
  state.activePlayer = undefined
}

export function revealClansInView(state: GameView, move: RevealClansView) {
  state.players.forEach(player =>
    (player as Player).clans = move.clans[player.tower]!
  )
  revealClans(state)
}