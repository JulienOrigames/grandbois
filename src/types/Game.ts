import Player from './Player'
import TowerColor from '../clans/TowerColor'
import PlacedTile from '../tiles/PlacedTile'
import Tile from '../tiles/Tile'

type Game = {
  players: Player[]
  deck: number[]
  river: (number|null)[]
  forest: PlacedTile[]
  activePlayer: TowerColor
  tilePlayed? : number
  tutorial?: boolean
  over:boolean
}

export default Game