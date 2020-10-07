import Player from './Player'
import TowerColor from '../clans/TowerColor'
import PlacedTile from '../tiles/PlacedTile'

type Game = {
  players: Player[]
  deck: number[]
  river: number[]
  forest: PlacedTile[]
  activePlayer: TowerColor
  tutorial?: boolean
}

export default Game