import MoveType from './MoveType'
import PlacedTile from '../tiles/PlacedTile'

type PlaceForestTile = {
  type: typeof MoveType.PlaceForestTile
  placedTile: PlacedTile
}

export function placeForestTile(placedTile: PlacedTile): PlaceForestTile {
  return{type: MoveType.PlaceForestTile, placedTile}
}

export default PlaceForestTile
