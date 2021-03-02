import {Eliminations, IncompleteInformation, SequentialGame, TimeLimit} from '@gamepark/rules-api'
import shuffle from 'lodash.shuffle'
import {XYCoord} from 'react-dnd'
import Game from './Game'
import GameOptions, {isGameOptions} from './GameOptions'
import GameView from './GameView'
import Clan, {clans} from './material/Clan'
import PlacedTile from './material/PlacedTile'
import {Bear, Clearing, isTroop, Space, Tower} from './material/Tile'
import {tiles} from './material/Tiles'
import TowerColor from './material/TowerColor'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {concede} from './moves/Concede'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {placeForestTile} from './moves/PlaceForestTile'
import {placeTower} from './moves/PlaceTower'
import {isRevealClansView} from './moves/RevealClans'
import {isRevealNewRiverTileView} from './moves/RevealNewRiverTile'
import Player from './Player'
import PlayerView from './PlayerView'
import {isGameView} from './typeguards'


const playersMin = 2
const playersMax = 5
export const defaultNumberOfPlayers = 3

export default class Grandbois extends SequentialGame<Game | GameView, Move, TowerColor> implements /* TODO Competitive<Move, TowerColor>,*/
  IncompleteInformation<Move, TowerColor, GameView, MoveView>, Eliminations<Move, TowerColor>, TimeLimit<TowerColor> {

  constructor(state: Game | GameView)
  constructor(options?: GameOptions)
  constructor(arg?: GameOptions | Game | GameView) {
    if (!arg || isGameOptions(arg)) {
      const startDeck = Array.from(tiles.keys())
      const tileStart = startDeck.splice(0, 1)[0]
      const deck = shuffle(startDeck)
      const players = setupPlayers(arg?.players)
      super({
        players,
        deck,
        river: deck.splice(0, 4),
        forest: [{tile: tileStart, x: 0, y: 0, rotation: 0}],
        activePlayer: players[0].tower,
        over: false
      })
    } else {
      super(arg)
    }
  }

  getPlayerIds() {
    return (this.state as Game).players.map(player => player.tower)
  }

  getPlayerName(tower: TowerColor, t: (name: string) => string): string {
    switch (tower) {
      case TowerColor.BlackTower:
        return t('Black player')
      case TowerColor.BlueTower:
        return t('Blue player')
      case TowerColor.BrownTower:
        return t('Brown player')
      case TowerColor.WhiteTower:
        return t('White player')
    }
  }

  getActivePlayer() {
    return this.state.over ? undefined : this.state.activePlayer
  }

  getAutomaticMove(): void | Move {
    if (!isGameView(this.state) && this.state.river.some(tile => !tile) && this.state.deck.length > 0)
      return {type: MoveType.RevealNewRiverTile}
    else if (!isGameView(this.state) && automaticEndOfTurn(this.state))
      return {type: MoveType.ChangeActivePlayer}
    else if (!isGameView(this.state) && isOver(this.state) && !this.state.over)
      return {type: MoveType.RevealClans}
  }

  getLegalMoves(): Move[] {
    let moves: Move[] = []

    if (this.state.tilePlayed === undefined) {
      const forestView = getForestView(this.state)
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
        this.state.river.flatMap(tile =>
          tile ? [0, 1, 2, 3].filter(rotation => isLegalTilePosition(forestView, {tile, x, y, rotation: rotation}))
            .map(rotation => placeForestTile({tile, x, y, rotation: rotation})
            ) : []
        )
      )
    } else if (activePlayerCanPlaceTower(this.state)) {
      moves.push(placeTower())
      moves.push(changeActivePlayer())
    }
    return moves
  }

  play(move: Move | MoveView) {
    switch (move.type) {
      case MoveType.PlaceForestTile: {
        this.state.forest.push(move.placedTile)
        this.state.river[this.state.river.indexOf(move.placedTile.tile)] = null
        this.state.tilePlayed = move.placedTile.tile
        break
      }
      case MoveType.RevealNewRiverTile: {
        if (isGameView(this.state)) {
          if (isRevealNewRiverTileView(move)) {
            this.state.river = move.newRiver
            this.state.deck--
          }
        } else {
          this.state.river[this.state.river.indexOf(null)] = this.state.deck.pop()!
        }
        break
      }
      case MoveType.ChangeActivePlayer: {
        delete this.state.tilePlayed
        const activePlayerIndex = this.state.players.findIndex(player => player.tower === this.state.activePlayer)
        const nextPlayerIndex = (activePlayerIndex + 1) % this.state.players.length
        this.state.activePlayer = this.state.players[nextPlayerIndex].tower
        break
      }
      case MoveType.PlaceTower: {
        const activePlayer = getPlayer(this.state, this.state.activePlayer)
        const clearingIndex = tiles[this.state.tilePlayed!].findIndex(space => space === Clearing)
        const tilePlayed = this.state.forest[this.state.forest.length - 1]
        activePlayer.towersPosition.push(getPlacedTileSpaceXY(tilePlayed, clearingIndex))
        break
      }
      case MoveType.RevealClans: {
        if (isRevealClansView(move)) {
          this.state.players.forEach(player =>
            (player as Player).clans = move.clans[player.tower]!
          )
        }
        this.state.over = true
        this.state.activePlayer = undefined
        break
      }
      case MoveType.Concede: {
        const player = getPlayer(this.state, move.playerId)
        player.eliminated = this.state.players.filter(player => player.eliminated).length + 1
        break
      }
    }
  }

  getView(playerId?: TowerColor): GameView {
    if (isGameView(this.state)) throw new Error('getView should only be used on server side')
    return {
      ...this.state,
      deck: this.state.deck.length,
      players: this.state.players.map(player => {
          if (player.tower === playerId || this.state.over) {
            return player
          } else {
            const {clans, ...playerView} = player
            return playerView
          }
        }
      )
    }
  }

  getMoveView(move: Move): MoveView {
    if (isGameView(this.state)) throw new Error('getMoveView should only be used on server side')
    switch (move.type) {
      case MoveType.RevealNewRiverTile:
        return {...move, newRiver: this.state.river}
      case MoveType.RevealClans:
        return {
          ...move, clans: this.state.players.reduce<{ [key in TowerColor]?: Clan[] }>((clans, player) => {
            clans[player.tower] = player.clans
            return clans
          }, {})

        }
    }
    return move
  }

  isEliminated(playerId: TowerColor): boolean {
    return !!getPlayer(this.state, playerId).eliminated
  }

  getConcedeMove(playerId: TowerColor): Move {
    return concede(playerId)
  }

  giveTime(): number {
    if (isGameView(this.state)) throw new Error('giveTime should only be used on server side')
    if (this.state.deck.length > 28) {
      return 120
    } else {
      return 60
    }
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

export const mod = (n: number, m: number) => ((n % m) + m) % m

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