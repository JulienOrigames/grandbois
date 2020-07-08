import Player from './Player'
import TowerColor from '../material/TowerColor'

type Game = {
  players: Player[]
  deck: number[]
  activePlayer: TowerColor
}

export default Game