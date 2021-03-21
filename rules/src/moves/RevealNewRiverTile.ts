import GameState from '../GameState'
import GameView from '../GameView'
import MoveType from './MoveType'

type RevealNewRiverTile = { type: typeof MoveType.RevealNewRiverTile }

export default RevealNewRiverTile

export type RevealNewRiverTileView = RevealNewRiverTile & { newRiver: (number | null)[] }

export function isRevealNewRiverTileView(move: RevealNewRiverTile | RevealNewRiverTileView): move is RevealNewRiverTileView {
  return (move as RevealNewRiverTileView).newRiver !== undefined
}

export function revealNewRiverTile(state: GameState) {
  state.river[state.river.indexOf(null)] = state.deck.pop()!
}

export function revealNewRiverTileInView(state: GameView, move: RevealNewRiverTileView) {
  state.river = move.newRiver
  state.deck--
}