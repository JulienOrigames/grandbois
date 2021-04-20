import {XYCoord} from 'react-dnd'
import GameState from './GameState'
import Player from './Player'
import PlayerView from './PlayerView'

type GameView = Omit<GameState, 'deck' | 'players'> & {
  deck: number
  players: (Player | PlayerView)[]
  forestCenter?: XYCoord
}

export default GameView