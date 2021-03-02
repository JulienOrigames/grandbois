import Player from './Player'
import TowerColor from './material/TowerColor'
import PlacedTile from './material/PlacedTile'

type Game = {
  players: Player[]
  deck: number[]
  river: (number | null)[]
  forest: PlacedTile[]
  activePlayer?: TowerColor
  tilePlayed?: number
  tutorial?: boolean
  over: boolean
}

export default Game