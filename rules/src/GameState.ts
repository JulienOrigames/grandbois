import PlacedTile from './material/PlacedTile'
import TowerColor from './material/TowerColor'
import Player from './Player'

type GameState = {
  players: Player[]
  deck: number[]
  river: (number | null)[]
  forest: PlacedTile[]
  activePlayer?: TowerColor
  tilePlayed?: number
  tutorial?: boolean
  over: boolean
}

export default GameState