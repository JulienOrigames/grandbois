import GameState from '../GameState'
import GameView from '../GameView'
import {getPlacedTileSpaceXY} from '../material/PlacedTile'
import {Clearing} from '../material/Tile'
import {tiles} from '../material/Tiles'
import MoveType from './MoveType'

type PlaceTower = {
  type: typeof MoveType.PlaceTower
}

export default PlaceTower

export function placeTower(state: GameState | GameView) {
  const activePlayer = state.players.find(player => player.tower === state.activePlayer)
  if (!activePlayer) return console.error(`No active player in ${state}, cannot place a tower!`)
  const clearingIndex = tiles[state.tilePlayed!].findIndex(space => space === Clearing)
  const tilePlayed = state.forest[state.forest.length - 1]
  activePlayer.towersPosition.push(getPlacedTileSpaceXY(tilePlayed, clearingIndex))
}