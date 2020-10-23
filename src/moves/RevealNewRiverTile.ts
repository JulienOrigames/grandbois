import MoveType from './MoveType'

type RevealNewRiverTile = { type: typeof MoveType.RevealNewRiverTile }

export default RevealNewRiverTile

export type RevealNewRiverTileView = RevealNewRiverTile
  & { newRiver: (number|null)[] }

export function isRevealNewRiverTileView(move: RevealNewRiverTile | RevealNewRiverTileView): move is RevealNewRiverTileView {
  return (move as RevealNewRiverTileView).newRiver !== undefined
}
