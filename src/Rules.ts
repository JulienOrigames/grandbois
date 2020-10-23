import SequentialGame from '@gamepark/workshop/dist/Types/SequentialGame'
import Game from './types/Game'
import Move, {MoveView} from './moves/Move'
import TowerColor from './clans/TowerColor'
import GameView from './types/GameView'
import {shuffle} from '@gamepark/workshop'
import Player from './types/Player'
import GameOptions from './types/GameOptions'
import {tiles} from './tiles/Tiles'
import GameWithIncompleteInformation from '@gamepark/workshop/dist/Types/GameWithIncompleteInformation'
import Clan, {clans} from './clans/Clan'
import PlayerView from './types/PlayerView'
import MoveType from './moves/MoveType'
import PlacedTile from './tiles/PlacedTile'
import {Bear, Clearing, Space} from './tiles/Tile'
import {placeForestTile} from './moves/PlaceForestTile'
import WithAutomaticMoves from '@gamepark/workshop/dist/Types/WithAutomaticMoves'
import {isGameView} from './types/typeguards'
import {isRevealNewRiverTileView} from './moves/RevealNewRiverTile'
import {mod} from './util/Styles'


const playersMin = 2
const playersMax = 5
export const defaultNumberOfPlayers = 4

type GameType = SequentialGame<Game, Move, TowerColor>
  & GameWithIncompleteInformation<Game, Move, TowerColor, GameView, Move>
  & WithAutomaticMoves<Game, Move>
/*& CompetitiveGame<Game, Move, EmpireName>
& GameWithIncompleteInformation<Game, Move, EmpireName, GameView, MoveView>
& WithOptions<Game, GameOptions>
& WithUndo<Game, Move, EmpireName>
& WithAnimations<GameView, MoveView, EmpireName, EmpireName>*/

const GrandBoisRules: GameType = {
  setup(options?: GameOptions) {

    const startDeck = Array.from(tiles.keys())
    const tileStart = startDeck.splice(0, 1)[0]
    const deck = shuffle(startDeck)
    const players = setupPlayers(options?.players)
    return {
      players,
      deck,
      river: deck.splice(0, 4),
      forest: [{tile: tileStart, x: 0, y: 0, rotation: 0}],
      activePlayer: players[0].tower
    }
  },
  getPlayerIds(game: Game) {
    return game.players.map(player => player.tower)
  },
  getActivePlayer(game: Game): TowerColor {
    return game.activePlayer
  },
  getAutomaticMove(game: Game | GameView): void | Move {
    if (!isGameView(game) && game.river.some(tile => !tile) && game.deck.length > 0) return {type: MoveType.RevealNewRiverTile}
    else if (!isGameView(game) && game.tilePlayed !== undefined) return {type: MoveType.ChangeActivePlayer} // TODO : Clearing and Tower ?
  },
  getLegalMoves(game: Game): Move[] {
    const forestView = getForestView(game.forest)
    console.log(forestView)
    const xMin = Math.min(...Array.from(forestView.keys()))
    const xMax = Math.max(...Array.from(forestView.keys()))
    const yMin = Math.min(...Array.from(forestView.values()).flatMap(map => Array.from(map.keys())))
    const yMax = Math.max(...Array.from(forestView.values()).flatMap(map => Array.from(map.keys())))
    const availablePositions = []
    for (let x = xMin - 1; x <= xMax + 1; x++) {
      for (let y = yMin - 1; y <= yMax + 1; y++) {
        if (isAvailablePosition(forestView, x, y)) availablePositions.push({x, y})
      }
    }
    console.log(availablePositions)
    return availablePositions.flatMap(({x, y}) =>
      game.river.flatMap(tile =>
        tile ? [0, 1, 2, 3].filter(rotation => isLegalTilePosition(forestView, {tile, x, y, rotation: rotation}))
          .map(rotation => placeForestTile({tile, x, y, rotation: rotation})
          ) : []
      )
    )
  },
  play(move: Move | MoveView, game: Game | GameView, playerId: TowerColor) {
    switch (move.type) {
      case MoveType.PlaceForestTile: {
        game.forest.push(move.placedTile)
        game.river[game.river.indexOf(move.placedTile.tile)] = null
        game.tilePlayed = move.placedTile.tile
        break
      }
      case MoveType.RevealNewRiverTile: {
        if (isGameView(game)) {
          if (isRevealNewRiverTileView(move)) {
            game.river = move.newRiver
            game.deck--
          }
        } else {
          game.river[game.river.indexOf(null)] = game.deck.pop()!
        }
        break
      }
      case MoveType.ChangeActivePlayer: {
        game.tilePlayed = undefined
        const activePlayerIndex = game.players.findIndex(player => player.tower === game.activePlayer)
        const nextPlayerIndex = (activePlayerIndex + 1) % game.players.length
        game.activePlayer = game.players[nextPlayerIndex].tower
        break
      }
    }
  },

  getView(game: Game, playerId?: TowerColor): GameView {
    return {
      ...game,
      deck: game.deck.length,
      players: game.players.map(player => {
          if (player.tower === playerId) {
            return player
          } else {
            const { clan, ...playerView } = player
            return playerView
          }
        }
      )
    }
  },

  getMoveView(move: Move, playerId: TowerColor, game: Game): MoveView {
    switch (move.type) {
      case MoveType.RevealNewRiverTile:
        return {...move, newRiver: game.river}
    }
    return move
  }
}

export function isOver(game: Game | GameView): boolean {
  return game.deck === 0 && game.river.length === 0
}

function setupPlayers(players?: number | { tower?: TowerColor }[]) {
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

function setupPlayer(tower: TowerColor, clan: Clan): Player {
  return {tower, clan: clan}
}

export function getPlayer(game: Game, tower: TowerColor): Player
export function getPlayer(game: Game | GameView, tower: TowerColor): Player | PlayerView
export function getPlayer(game: Game | GameView, tower: TowerColor): Player | PlayerView {
  return game.players.find(player => player.tower === tower)!
}

type ForestView = Map<number, Map<number, Space>>

export function getForestView(forest: PlacedTile[]) {
  const forestView: ForestView = new Map()
  for (const placedTile of forest) {
    if (!forestView.has(placedTile.x)) forestView.set(placedTile.x, new Map())
    if (!forestView.has(placedTile.x + 1)) forestView.set(placedTile.x + 1, new Map())
    forestView.get(placedTile.x)!.set(placedTile.y, tiles[placedTile.tile][mod((0 - placedTile.rotation), 4)])
    forestView.get(placedTile.x + 1)!.set(placedTile.y, tiles[placedTile.tile][mod((1 - placedTile.rotation), 4)])
    forestView.get(placedTile.x + 1)!.set(placedTile.y + 1, tiles[placedTile.tile][mod((2 - placedTile.rotation), 4)])
    forestView.get(placedTile.x)!.set(placedTile.y + 1, tiles[placedTile.tile][mod((3 - placedTile.rotation), 4)])
  }
  return forestView
}

export function isAvailablePosition(forestView: ForestView, x: number, y: number) {
  let fullSpace = 0
  if (forestView.get(x)?.get(y)) fullSpace++
  if (forestView.get(x + 1)?.get(y)) fullSpace++
  if (forestView.get(x + 1)?.get(y + 1)) fullSpace++
  if (forestView.get(x)?.get(y + 1)) fullSpace++
  return fullSpace > 0 && fullSpace < 4
}

export function isLegalTilePosition(forestView: ForestView, placedTile: PlacedTile) {
  if (!isAvailablePosition(forestView, placedTile.x, placedTile.y)) return false
  let legalSpace = 0
  if (canCoverSpace(getPlacedSpace(placedTile, 0), forestView.get(placedTile.x)?.get(placedTile.y))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 1), forestView.get(placedTile.x + 1)?.get(placedTile.y))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 2), forestView.get(placedTile.x + 1)?.get(placedTile.y + 1))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 3), forestView.get(placedTile.x)?.get(placedTile.y + 1))) legalSpace++
  // console.log(placedTile.rotation)
  // console.log(getPlacedSpace(placedTile,0))
  // console.log('=>')
  // console.log(forestView.get(placedTile.x)?.get(placedTile.y))
  // console.log(getPlacedSpace(placedTile,1))
  // console.log('=>')
  // console.log(forestView.get(placedTile.x+1)?.get(placedTile.y))
  // console.log(getPlacedSpace(placedTile,2))
  // console.log('=>')
  // console.log(forestView.get(placedTile.x+1)?.get(placedTile.y+1))
  // console.log(getPlacedSpace(placedTile,3))
  // console.log('=>')
  // console.log(forestView.get(placedTile.x)?.get(placedTile.y+1))
  return legalSpace === 4
}

function canCoverSpace(overSpace: Space, underSpace: Space | undefined) {
  if (underSpace === Bear) return false // TODO : add Tower condition
  if (underSpace === undefined || underSpace === Clearing || overSpace === Bear) return true
  if (overSpace === Clearing) return false
  return (overSpace.size > underSpace.size)
}

const getPlacedSpace = (placedTile: PlacedTile, space: number) => tiles[placedTile.tile][mod((space - placedTile.rotation), 4)]

export default GrandBoisRules