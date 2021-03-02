import Game from './Game'
import GameView from './GameView'
import TowerColor from './material/TowerColor'

type GameOptions = {
  players?: number | { tower?: TowerColor }[]
}

export default GameOptions

export function isGameOptions(arg: Game | GameView | GameOptions): arg is GameOptions {
  return typeof (arg as Game).deck === 'undefined'
}
