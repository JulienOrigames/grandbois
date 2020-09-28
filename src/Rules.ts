import SequentialGame from '@interlude-games/workshop/dist/Types/SequentialGame'
import Game from './types/Game'
import Move from './moves/Move'
import TowerColor from './clans/TowerColor'
import GameView from './types/GameView'
import {shuffle} from '@interlude-games/workshop'
import Player from './types/Player'
import GameOptions from './types/GameOptions'
import {tiles} from './tiles/Tiles'
import GameWithIncompleteInformation from '@interlude-games/workshop/dist/Types/GameWithIncompleteInformation'


const playersMin = 2
const playersMax = 5
export const defaultNumberOfPlayers = 3

type GameType = SequentialGame<Game, Move, TowerColor>
  & GameWithIncompleteInformation<Game, Move, TowerColor, GameView, Move>
  /*& CompetitiveGame<Game, Move, EmpireName>
  & GameWithIncompleteInformation<Game, Move, EmpireName, GameView, MoveView>
  & WithOptions<Game, GameOptions>
  & WithAutomaticMoves<Game, Move>
  & WithUndo<Game, Move, EmpireName>
  & WithAnimations<GameView, MoveView, EmpireName, EmpireName>*/

const GrandBoisRules: GameType = {
  setup(options?: GameOptions) {
    const deck = shuffle(Array.from(tiles.keys()))
    return {
      players: setupPlayers(options?.players),
      deck,
      river: deck.splice(0,4),
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
  play(){},

  getView(game: Game, playerId?: TowerColor): GameView {
    return {
      ...game, deck: game.deck.length
    }
  },

  getMoveView(move: Move, playerId: TowerColor, game: Game): Move {
    return move
  }
}

export function isOver(game: Game | GameView): boolean {
  return false
}

function setupPlayers( players?: number | { clan?: TowerColor }[] ) {
  if (Array.isArray(players) && players.length >= playersMin && players.length <= playersMax) {
    const empiresLeft = shuffle(Object.values(TowerColor).filter(clan => players.some(player => player.clan === clan)))
    return players.map<Player>(player => setupPlayer(player.clan || empiresLeft.pop()!))
  } else if (typeof players === 'number' && Number.isInteger(players) && players >= playersMin && players <= playersMax) {
    return shuffle(Object.values(TowerColor)).slice(0, players).map<Player>(clan => setupPlayer(clan))
  } else {
    return shuffle(Object.values(TowerColor)).slice(0, defaultNumberOfPlayers).map<Player>(clan => setupPlayer(clan))
  }
}

function setupPlayer(tower: TowerColor): Player {
  return { tower }
}

export default GrandBoisRules