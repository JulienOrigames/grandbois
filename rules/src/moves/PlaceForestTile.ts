import GameState from '../GameState'
import GameView from '../GameView'
import PlacedTile from '../material/PlacedTile'
import MoveType from './MoveType'

type PlaceForestTile = {
  type: typeof MoveType.PlaceForestTile
  placedTile: PlacedTile
}

export default PlaceForestTile

export function placeForestTile(state: GameState | GameView, move: PlaceForestTile) {
  state.forest.push(move.placedTile)
  state.river[state.river.indexOf(move.placedTile.tile)] = null
  state.tilePlayed = move.placedTile.tile
}