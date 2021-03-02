import PlacedTile from '../material/PlacedTile'
import MoveType from './MoveType'

type PlaceForestTile = {
  type: typeof MoveType.PlaceForestTile
  placedTile: PlacedTile
}

export function placeForestTile(placedTile: PlacedTile): PlaceForestTile {
  return{type: MoveType.PlaceForestTile, placedTile}
}

export default PlaceForestTile
