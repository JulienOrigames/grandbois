import SequentialGame from '@interlude-games/workshop/dist/Types/SequentialGame'
import Game from './types/Game'
import Move from './moves/Move'
import TowerColor from './material/TowerColor'

type GameType = SequentialGame<Game, Move, TowerColor>
  /*& CompetitiveGame<Game, Move, EmpireName>
  & GameWithIncompleteInformation<Game, Move, EmpireName, GameView, MoveView>
  & WithOptions<Game, GameOptions>
  & WithAutomaticMoves<Game, Move>
  & WithUndo<Game, Move, EmpireName>
  & WithAnimations<GameView, MoveView, EmpireName, EmpireName>*/

const GrandBoisRules: GameType = {
  setup() {
    return {
      players: [],
      deck: [],
      activePlayer: TowerColor.BlackTower
    }
  },
  getPlayerIds(game: Game) {
    return game.players.map(player => player.tower)
  },
  getActivePlayer(game: Game): TowerColor {
    return game.activePlayer
  },
  getLegalMoves(game: Game): Move[] {
    return []
  },
  play(){}
}

export default GrandBoisRules