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
import Clan, {clans} from './clans/Clan'
import PlayerView from './types/PlayerView'


const playersMin = 2
const playersMax = 5
export const defaultNumberOfPlayers = 4

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

    const startDeck = Array.from(tiles.keys())
    const tileStart = startDeck.splice(0,1)[0];
    const deck = shuffle(startDeck)
    return {
      players: setupPlayers(options?.players),
      deck,
      river: deck.splice(0,4),
      forest:[{tile:tileStart,x:0,y:0,rotate:0},{tile:deck.splice(0,1)[0],x:1,y:-1,rotate:180},{tile:deck.splice(0,1)[0],x:-1,y:1,rotate:180}],
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
  return game.deck === 0 && game.river.length === 0
}

function setupPlayers( players?: number | { tower?: TowerColor }[] ) {
  const shuffledClans = shuffle(clans)
  if (Array.isArray(players) && players.length >= playersMin && players.length <= playersMax) {
    const towerLeft = shuffle(Object.values(TowerColor).filter(tower => players.some(player => player.tower === tower)))
    return players.map<Player>(player => setupPlayer(player.tower || towerLeft.pop()!, shuffledClans.pop()!))
  } else if (typeof players === 'number' && Number.isInteger(players) && players >= playersMin && players <= playersMax) {
    return shuffle(Object.values(TowerColor)).slice(0, players).map<Player>(tower => setupPlayer(tower, shuffledClans.pop()!))
  } else {
    return shuffle(Object.values(TowerColor)).slice(0, defaultNumberOfPlayers).map<Player>(tower => setupPlayer(tower, shuffledClans.pop()!))
  }
}

function setupPlayer(tower: TowerColor, clan : Clan): Player {
  return { tower, clan : clan }
}

export function getPlayer(game: Game, tower: TowerColor): Player
export function getPlayer(game: Game | GameView, tower: TowerColor): Player | PlayerView
export function getPlayer(game: Game | GameView, tower: TowerColor): Player | PlayerView {
  return game.players.find(player => player.tower === tower)!
}

export default GrandBoisRules