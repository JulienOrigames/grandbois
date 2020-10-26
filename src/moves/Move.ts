import RevealNewRiverTile, {RevealNewRiverTileView} from './RevealNewRiverTile'
import PlaceForestTile from './PlaceForestTile'
import ChangeActivePlayer from './ChangeActivePlayer'
import PlaceTower from './PlaceTower'

type Move = RevealNewRiverTile | PlaceForestTile | ChangeActivePlayer | PlaceTower

export default Move

export type MoveView = Move | RevealNewRiverTileView