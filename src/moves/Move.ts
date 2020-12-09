import RevealNewRiverTile, {RevealNewRiverTileView} from './RevealNewRiverTile'
import PlaceForestTile from './PlaceForestTile'
import ChangeActivePlayer from './ChangeActivePlayer'
import PlaceTower from './PlaceTower'
import RevealClans, {RevealClansView} from './RevealClans'
import Concede from './Concede'

type Move = RevealNewRiverTile | PlaceForestTile | ChangeActivePlayer | PlaceTower | RevealClans | Concede

export default Move

export type MoveView = Move | RevealNewRiverTileView | RevealClansView