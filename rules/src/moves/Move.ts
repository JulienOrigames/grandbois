import ChangeActivePlayer from './ChangeActivePlayer'
import Concede from './Concede'
import PlaceForestTile from './PlaceForestTile'
import PlaceTower from './PlaceTower'
import RevealClans, {RevealClansView} from './RevealClans'
import RevealNewRiverTile, {RevealNewRiverTileView} from './RevealNewRiverTile'

type Move = RevealNewRiverTile | PlaceForestTile | ChangeActivePlayer | PlaceTower | RevealClans | Concede

export default Move

export type MoveView = Exclude<Move, RevealNewRiverTile | RevealClans> | RevealNewRiverTileView | RevealClansView