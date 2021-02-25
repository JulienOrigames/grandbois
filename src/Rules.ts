import SequentialGame from '@gamepark/workshop/dist/Types/SequentialGame'
import {TFunction} from 'i18next'
import Game from './types/Game'
import Move, {MoveView} from './moves/Move'
import TowerColor from './clans/TowerColor'
import GameView from './types/GameView'
import {shuffle, WithEliminations, WithTimeLimit, WithTutorial} from '@gamepark/workshop'
import Player from './types/Player'
import GameOptions from './types/GameOptions'
import {tiles} from './tiles/Tiles'
import GameWithIncompleteInformation from '@gamepark/workshop/dist/Types/GameWithIncompleteInformation'
import Clan, {clans} from './clans/Clan'
import PlayerView from './types/PlayerView'
import MoveType from './moves/MoveType'
import PlacedTile from './tiles/PlacedTile'
import {Bear, Clearing, isTroop, Space, Tower} from './tiles/Tile'
import {placeForestTile} from './moves/PlaceForestTile'
import WithAutomaticMoves from '@gamepark/workshop/dist/Types/WithAutomaticMoves'
import {isGameView} from './types/typeguards'
import {isRevealNewRiverTileView} from './moves/RevealNewRiverTile'
import {mod} from './util/Styles'
import {placeTower} from './moves/PlaceTower'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {isRevealClansView} from './moves/RevealClans'
import {XYCoord} from 'react-dnd'
import {concede} from './moves/Concede'
import {setupTutorial, tutorialMoves} from './Tutorial'


const playersMin = 2
const playersMax = 5
export const defaultNumberOfPlayers = 3

type GameType = SequentialGame<Game, Move, TowerColor>
  & GameWithIncompleteInformation<Game, Move, TowerColor, GameView, Move>
  & WithAutomaticMoves<Game, Move>
  & WithTimeLimit<Game, TowerColor>
  & WithEliminations<Game, Move, TowerColor>
  & WithTutorial<Game, Move>
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
      activePlayer: players[0].tower,
      over: false
    }
  },
  getPlayerIds(game: Game) {
    return game.players.map(player => player.tower)
  },
  getPlayerName(tower: TowerColor, t: TFunction): string {
    switch (tower) {
      case TowerColor.BlackTower:
        return t('Joueur noir')
      case TowerColor.BlueTower:
        return t('Joueur bleu')
      case TowerColor.BrownTower:
        return t('Joueur marron')
      case TowerColor.WhiteTower:
        return t('Joueur blanc')
    }
  },
  getActivePlayer(game: Game) {
    return game.over?undefined:game.activePlayer
  },
  getAutomaticMove(game: Game | GameView): void | Move {
    if (!isGameView(game) && game.river.some(tile => !tile) && game.deck.length > 0)
      return {type: MoveType.RevealNewRiverTile}
    else if (!isGameView(game) && automaticEndOfTurn(game))
      return {type: MoveType.ChangeActivePlayer}
    else if (!isGameView(game) && isOver(game) && !game.over)
      return {type: MoveType.RevealClans}
  },
  getLegalMoves(game: Game): Move[] {
    let moves: Move[] = []

    if (game.tilePlayed === undefined) {
      const forestView = getForestView(game)
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
      moves = availablePositions.flatMap(({x, y}) =>
        game.river.flatMap(tile =>
          tile ? [0, 1, 2, 3].filter(rotation => isLegalTilePosition(forestView, {tile, x, y, rotation: rotation}))
            .map(rotation => placeForestTile({tile, x, y, rotation: rotation})
            ) : []
        )
      )
    } else if (activePlayerCanPlaceTower(game)) {
      moves.push(placeTower())
      moves.push(changeActivePlayer())
    }
    return moves
  },
  play(move: Move | MoveView, game: Game | GameView) {
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
        delete game.tilePlayed
        const activePlayerIndex = game.players.findIndex(player => player.tower === game.activePlayer)
        const nextPlayerIndex = (activePlayerIndex + 1) % game.players.length
        game.activePlayer = game.players[nextPlayerIndex].tower
        break
      }
      case MoveType.PlaceTower: {
        const activePlayer = getPlayer(game, game.activePlayer)
        const clearingIndex = tiles[game.tilePlayed!].findIndex(space => space === Clearing)
        const tilePlayed = game.forest[game.forest.length - 1]
        activePlayer.towersPosition.push(getPlacedTileSpaceXY(tilePlayed, clearingIndex))
        break
      }
      case MoveType.RevealClans: {
        if (isRevealClansView(move)) {
          game.players.forEach(player =>
            (player as Player).clans = move.clans[player.tower]!
          )
        }
        game.over = true
        game.activePlayer = undefined
        break
      }
      case MoveType.Concede: {
        const player = getPlayer(game, move.playerId)
        player.eliminated = game.players.filter(player => player.eliminated).length + 1
        break
      }
    }
  },

  getView(game: Game, playerId?: TowerColor): GameView {
    return {
      ...game,
      deck: game.deck.length,
      players: game.players.map(player => {
          if (player.tower === playerId || game.over) {
            return player
          } else {
            const {clans, ...playerView} = player
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
      case MoveType.RevealClans:
        return {
          ...move, clans: game.players.reduce<{ [key in TowerColor]?: Clan[] }>((clans, player) => {
            clans[player.tower] = player.clans
            return clans
          }, {})

        }
    }
    return move
  },

  isEliminated(game: Game, playerId: TowerColor): boolean {
    return !!getPlayer(game, playerId).eliminated
  },

  getConcedeMove(playerId: TowerColor): Move {
    return concede(playerId)
  },

  giveTime(game: Game, playerId: TowerColor): number {
    if (game.deck.length > 28) {
       return 120
    }else{
       return 60
    }
  },

  setupTutorial(): Game {
    return setupTutorial()
  },

  expectedMoves(): Move[] {
    return tutorialMoves
  }

}

export function isOver(game: Game | GameView): boolean {
  const deckLength = isGameView(game) ? game.deck : game.deck.length
  return deckLength === 0 && !game.river.some(tile => tile)
}

export function setupPlayers(players?: number | { tower?: TowerColor }[]) {
  let playersList
  let shuffledClans:Clan[] = []
  // give towerColors
  if (Array.isArray(players) && players.length >= playersMin && players.length <= playersMax) {
    const towerLeft = shuffle(Object.values(TowerColor).filter(tower => players.some(player => player.tower === tower)))
    playersList = players.map<Player>(player => setupPlayer(player.tower || towerLeft.pop()!, shuffledClans))
  } else if (typeof players === 'number' && Number.isInteger(players) && players >= playersMin && players <= playersMax) {
    playersList = shuffle(Object.values(TowerColor)).slice(0, players).map<Player>(tower => setupPlayer(tower,shuffledClans))
  } else {
    playersList = shuffle(Object.values(TowerColor)).slice(0, defaultNumberOfPlayers).map<Player>(tower => setupPlayer(tower,shuffledClans))
  }
  // give clans
  shuffledClans = shuffle(clans)
  if( playersList.length === 2 ){
    return playersList.map<Player>(player => setupPlayer(player.tower, [shuffledClans.pop()!,shuffledClans.pop()!] ))
  }
  else{
    return playersList.map<Player>(player => setupPlayer(player.tower, [shuffledClans.pop()!] ))
  }
}

function setupPlayer(tower: TowerColor, clans: Clan[]): Player {
  return {tower, clans: clans, towersPosition: []}
}

export function getPlayer(game: Game, tower?: TowerColor): Player
export function getPlayer(game: Game | GameView, tower?: TowerColor): Player | PlayerView
export function getPlayer(game: Game | GameView, tower?: TowerColor): Player | PlayerView {
  return game.players.find(player => player.tower === tower)!
}

type ForestView = Map<number, Map<number, Space>>

export function getForestView(game: Game | GameView) {
  const forestView: ForestView = new Map()
  for (const placedTile of game.forest) {
    if (!forestView.has(placedTile.x)) forestView.set(placedTile.x, new Map())
    if (!forestView.has(placedTile.x + 1)) forestView.set(placedTile.x + 1, new Map())
    forestView.get(placedTile.x)!.set(placedTile.y, tiles[placedTile.tile][mod((0 - placedTile.rotation), 4)])
    forestView.get(placedTile.x + 1)!.set(placedTile.y, tiles[placedTile.tile][mod((1 - placedTile.rotation), 4)])
    forestView.get(placedTile.x + 1)!.set(placedTile.y + 1, tiles[placedTile.tile][mod((2 - placedTile.rotation), 4)])
    forestView.get(placedTile.x)!.set(placedTile.y + 1, tiles[placedTile.tile][mod((3 - placedTile.rotation), 4)])
  }
  game.players.forEach(player =>
    player.towersPosition.forEach( towerPosition => forestView.get(towerPosition.x)!.set(towerPosition.y, Tower) )
  )
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

export function isSpaceClan(forestView: ForestView, x: number, y: number, clan: Clan) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && space.clan === clan
}

export function isSpaceClans(forestView: ForestView, x: number, y: number, clans: Clan[]) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && clans.indexOf(space.clan) !== -1
}

export function isSpaceOtherClan(forestView: ForestView, x: number, y: number, clan: Clan) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && space.clan !== clan
}

export function isSpaceOtherClans(forestView: ForestView, x: number, y: number, clans: Clan[]) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && clans.indexOf(space.clan) === -1
}

export function isLegalTilePosition(forestView: ForestView, placedTile: PlacedTile) {
  if (!isAvailablePosition(forestView, placedTile.x, placedTile.y)) return false
  let legalSpace = 0
  if (canCoverSpace(getPlacedSpace(placedTile, 0), forestView.get(placedTile.x)?.get(placedTile.y))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 1), forestView.get(placedTile.x + 1)?.get(placedTile.y))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 2), forestView.get(placedTile.x + 1)?.get(placedTile.y + 1))) legalSpace++
  if (canCoverSpace(getPlacedSpace(placedTile, 3), forestView.get(placedTile.x)?.get(placedTile.y + 1))) legalSpace++
  return legalSpace === 4
}

function canCoverSpace(overSpace: Space, underSpace: Space | undefined) {
  if (underSpace === Bear || underSpace === Tower) return false
  if (underSpace === undefined || underSpace === Clearing || overSpace === Bear || overSpace === Tower) return true
  if (overSpace === Clearing) return false
  return (overSpace.size > underSpace.size)
}

const getPlacedSpace = (placedTile: PlacedTile, space: number) => tiles[placedTile.tile][mod((space - placedTile.rotation), 4)]

export function getPlacedTileSpaceXY(placedTile: PlacedTile, space: number) {
  switch (mod((space + placedTile.rotation), 4)) {
    case 0 :
      return {x: placedTile.x, y: placedTile.y}
    case 1 :
      return {x: placedTile.x + 1, y: placedTile.y}
    case 2 :
      return {x: placedTile.x + 1, y: placedTile.y + 1}
    default :
      return {x: placedTile.x, y: placedTile.y + 1}
  }
}

export function activePlayerCanPlaceTower(game: Game | GameView) {
  const activePlayer = getPlayer(game, game.activePlayer)
  const twoPlayersGame = game.players.length === 2
  return game.tilePlayed !== undefined
    && ( twoPlayersGame ? activePlayer.towersPosition.length < 2 : activePlayer.towersPosition.length === 0 )
    && tiles[game.tilePlayed].find(space => space === Clearing)
    && !( twoPlayersGame && activePlayer.towersPosition.length === 1 && isTowerJustPlayed(game, activePlayer.towersPosition[0]) )
}

export function automaticEndOfTurn(game: Game | GameView) {
  const activePlayer = getPlayer(game, game.activePlayer)
  const twoPlayersGame = game.players.length === 2
  return game.tilePlayed !== undefined
    && (
         ( twoPlayersGame ? activePlayer.towersPosition.length === 2 : activePlayer.towersPosition.length === 1 )
      || ( twoPlayersGame && activePlayer.towersPosition.length === 1 && isTowerJustPlayed(game, activePlayer.towersPosition[0]) )
      || !tiles[game.tilePlayed].find(space => space === Clearing)
    )
}

function isTowerJustPlayed(game: Game | GameView, towerPosition: XYCoord){
  const lastTile = game.forest[game.forest.length - 1]
  return    ( towerPosition.x === lastTile.x || (towerPosition.x - lastTile.x) === 1 )
         && ( towerPosition.y === lastTile.y || (towerPosition.y - lastTile.y) === 1 )
}

type playerScores = { clanPoints:number, greatestClanPoints:number, towerClanPoints:number, towerOtherClansPoints:number }

export function getPlayerScores(clans: Clan[], towersPosition: XYCoord[], forestView: ForestView): playerScores {
  return {
    clanPoints: clans.reduce((score, clan) => score + getClanPoints(clan, forestView), 0),
    greatestClanPoints: clans.reduce((score, clan) => score + getGreatestClanPoints(clan, forestView),0),
    towerClanPoints: towersPosition.reduce((score, towerPosition) => score + getTowerClanPoints(clans, towerPosition, forestView), 0),
    towerOtherClansPoints: towersPosition.reduce((score, towerPosition) => score + getTowerOtherClansPoints(clans, towerPosition, forestView), 0)
  }
}

export function getClanPoints(clan: Clan, forestView: ForestView): number {
  let clanNumber = 0
  const xMin = Math.min(...Array.from(forestView.keys()))
  const xMax = Math.max(...Array.from(forestView.keys()))
  const yMin = Math.min(...Array.from(forestView.values()).flatMap(map => Array.from(map.keys())))
  const yMax = Math.max(...Array.from(forestView.values()).flatMap(map => Array.from(map.keys())))
  for (let x = xMin - 1; x <= xMax + 1; x++) {
    for (let y = yMin - 1; y <= yMax + 1; y++) {
      if (isSpaceClan(forestView, x, y, clan)) clanNumber++
    }
  }
  return clanNumber
}

export function getGreatestClanPoints(clan: Clan, forestView: ForestView): number {
  let clanAreas: XYCoord[][] = []
  forestView.forEach((line, x) =>
    line.forEach((space, y) => {
        if (isTroop(space) && space.clan === clan) {
          const adjacentAreas = clanAreas.filter(area => area.some(coordinates => (Math.abs(x - coordinates.x) + Math.abs(y - coordinates.y)) === 1))
          if (adjacentAreas.length === 0) clanAreas.push([{x, y}])
          else {
            adjacentAreas[0].push({x, y})
            const areasToMerge = adjacentAreas.slice(1)
            areasToMerge.forEach(area => adjacentAreas[0].push(...area))
            clanAreas = clanAreas.filter(area => !areasToMerge.includes(area))
          }
        }
      }
    )
  )
  return Math.max(...clanAreas.map(area => area.length)) * 2
}

export function getTowerClanPoints(clans: Clan[], towerPosition: XYCoord | undefined, forestView: ForestView): number {
  if (!towerPosition) return 0
  let clanNumber = 0
  for (let x = towerPosition.x - 1; x <= towerPosition.x + 1; x++) {
    for (let y = towerPosition.y - 1; y <= towerPosition.y + 1; y++) {
      if (isSpaceClans(forestView, x, y, clans)) clanNumber++
    }
  }
  return clanNumber * 2
}

export function getTowerOtherClansPoints(clans: Clan[], towerPosition: XYCoord | undefined, forestView: ForestView): number {
  if (!towerPosition) return 0
  let clanNumber = 0
  for (let x = towerPosition.x - 1; x <= towerPosition.x + 1; x++) {
    for (let y = towerPosition.y - 1; y <= towerPosition.y + 1; y++) {
      if (isSpaceOtherClans(forestView, x, y, clans)) clanNumber++
    }
  }
  return clanNumber
}

export function isActive(game: Game | GameView, playerId: TowerColor) {
  const player = game.players.find(player => player.tower === playerId)!
  return player.tower === game.activePlayer
}

export default GrandBoisRules