import RevealNewRiverTile, {RevealNewRiverTileView} from './RevealNewRiverTile'
import PlaceForestTile from './PlaceForestTile'
import ChangeActivePlayer from './ChangeActivePlayer'

type Move = RevealNewRiverTile | PlaceForestTile | ChangeActivePlayer

export default Move

export type MoveView = Move | RevealNewRiverTileView