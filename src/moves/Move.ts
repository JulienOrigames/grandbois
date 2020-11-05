import RevealNewRiverTile, {RevealNewRiverTileView} from './RevealNewRiverTile'
import PlaceForestTile from './PlaceForestTile'
import ChangeActivePlayer from './ChangeActivePlayer'
import PlaceTower from './PlaceTower'
import RevealClans, {RevealClansView} from './RevealClans'

type Move = RevealNewRiverTile | PlaceForestTile | ChangeActivePlayer | PlaceTower | RevealClans

export default Move

export type MoveView = Move | RevealNewRiverTileView | RevealClansView