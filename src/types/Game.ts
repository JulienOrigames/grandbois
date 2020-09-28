import Player from './Player'
import TowerColor from '../clans/TowerColor'

type Game = {
  players: Player[]
  deck: number[]
  river: number[]
  activePlayer: TowerColor
  tutorial?: boolean
}

export default Game