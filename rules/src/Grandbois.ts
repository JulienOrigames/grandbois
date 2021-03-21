import {Eliminations, SecretInformation, SequentialGame, TimeLimit} from '@gamepark/rules-api'
import shuffle from 'lodash.shuffle'
import {XYCoord} from 'react-dnd'
import ForestView, {getForestView, isAvailablePosition, isLegalTilePosition} from './ForestView'
import GameState from './GameState'
import GameView from './GameView'
import GrandboisOptions, {GrandboisPlayerOptions, isGrandboisOptions} from './GrandboisOptions'
import Clan from './material/Clan'
import {Clearing, isTroop} from './material/Tile'
import {tiles} from './material/Tiles'
import TowerColor from './material/TowerColor'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import {concede} from './moves/Concede'
import Move, {MoveView} from './moves/Move'
import MoveType from './moves/MoveType'
import {placeForestTile} from './moves/PlaceForestTile'
import {placeTower} from './moves/PlaceTower'
import {revealClans} from './moves/RevealClans'
import {revealNewRiverTile} from './moves/RevealNewRiverTile'
import Player from './Player'

export const defaultNumberOfPlayers = 3

export default class Grandbois extends SequentialGame<GameState, Move, TowerColor> implements /* TODO Competitive<Move, TowerColor>,*/
  SecretInformation<GameState, GameView, Move, MoveView, TowerColor>, Eliminations<GameState, Move, TowerColor>, TimeLimit<GameState, Move, TowerColor> {

  constructor(state: GameState)
  constructor(options: GrandboisOptions)
  constructor(arg: GrandboisOptions | GameState) {
    if (isGrandboisOptions(arg)) {
      const startDeck = Array.from(tiles.keys())
      const tileStart = startDeck.splice(0, 1)[0]
      const deck = shuffle(startDeck)
      const players = setupPlayers(arg.players)
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

  isOver(): boolean {
    return this.state.over
  }

  getActivePlayer() {
    return this.isOver() ? undefined : this.state.activePlayer
  }

  getAutomaticMove(): void | Move {
    if (this.state.river.some(tile => !tile) && this.state.deck.length > 0)
      return {type: MoveType.RevealNewRiverTile}
    else if (automaticEndOfTurn(this.state))
      return {type: MoveType.ChangeActivePlayer}
    else if (this.state.deck.length === 0 && !this.state.river.some(tile => tile) && !this.state.over)
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
            .map(rotation => ({type: MoveType.PlaceForestTile, placedTile: {tile, x, y, rotation: rotation}})
            ) : []
        )
      )
    } else if (activePlayerCanPlaceTower(this.state)) {
      moves.push({type: MoveType.PlaceTower})
      moves.push({type: MoveType.ChangeActivePlayer})
    }
    return moves
  }

  play(move: Move) {
    switch (move.type) {
      case MoveType.PlaceForestTile:
        return placeForestTile(this.state, move)
      case MoveType.RevealNewRiverTile:
        return revealNewRiverTile(this.state)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state)
      case MoveType.PlaceTower:
        return placeTower(this.state)
      case MoveType.RevealClans:
        return revealClans(this.state)
      case MoveType.Concede:
        return concede(this.state, move)
    }
  }

  getView(playerId?: TowerColor): GameView {
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

  getPlayerView(playerId: TowerColor): GameView {
    return this.getView(playerId)
  }

  getMoveView(move: Move): MoveView {
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
    return !!this.state.players.find(player => player.tower === playerId)?.eliminated
  }

  getConcedeMove(playerId: TowerColor): Move {
    return {type: MoveType.Concede, playerId}
  }

  giveTime(): number {
    if (this.state.deck.length > 28) {
      return 120
    } else {
      return 60
    }
  }
}

export function setupPlayers(playerOptions: GrandboisPlayerOptions[]): Player[] {
  const clans = shuffle(Object.values(Clan))
  return playerOptions.map(options => ({
    tower: options.id,
    clans: clans.splice(0, playerOptions.length === 2 ? 2 : 1),
    towersPosition: []
  }))
}

export function isSpaceClan(forestView: ForestView, x: number, y: number, clan: Clan) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && space.clan === clan
}

export function isSpaceClans(forestView: ForestView, x: number, y: number, clans: Clan[]) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && clans.indexOf(space.clan) !== -1
}

export function isSpaceOtherClans(forestView: ForestView, x: number, y: number, clans: Clan[]) {
  const space = forestView.get(x)?.get(y)
  return space && isTroop(space) && clans.indexOf(space.clan) === -1
}

export function activePlayerCanPlaceTower(game: GameState | GameView) {
  const activePlayer = game.players.find(player => player.tower === game.activePlayer)
  if (!activePlayer) return false
  const twoPlayersGame = game.players.length === 2
  return game.tilePlayed !== undefined
    && (twoPlayersGame ? activePlayer.towersPosition.length < 2 : activePlayer.towersPosition.length === 0)
    && tiles[game.tilePlayed].find(space => space === Clearing)
    && !(twoPlayersGame && activePlayer.towersPosition.length === 1 && isTowerJustPlayed(game, activePlayer.towersPosition[0]))
}

export function automaticEndOfTurn(game: GameState | GameView) {
  const activePlayer = game.players.find(player => player.tower === game.activePlayer)
  if (!activePlayer) return false
  const twoPlayersGame = game.players.length === 2
  return game.tilePlayed !== undefined
    && (
      (twoPlayersGame ? activePlayer.towersPosition.length === 2 : activePlayer.towersPosition.length === 1)
      || (twoPlayersGame && activePlayer.towersPosition.length === 1 && isTowerJustPlayed(game, activePlayer.towersPosition[0]))
      || !tiles[game.tilePlayed].find(space => space === Clearing)
    )
}

function isTowerJustPlayed(game: GameState | GameView, towerPosition: XYCoord) {
  const lastTile = game.forest[game.forest.length - 1]
  return (towerPosition.x === lastTile.x || (towerPosition.x - lastTile.x) === 1)
    && (towerPosition.y === lastTile.y || (towerPosition.y - lastTile.y) === 1)
}

type playerScores = { clanPoints: number, greatestClanPoints: number, towerClanPoints: number, towerOtherClansPoints: number }

export function getPlayerScores(clans: Clan[], towersPosition: XYCoord[], forestView: ForestView): playerScores {
  return {
    clanPoints: clans.reduce((score, clan) => score + getClanPoints(clan, forestView), 0),
    greatestClanPoints: clans.reduce((score, clan) => score + getGreatestClanPoints(clan, forestView), 0),
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
