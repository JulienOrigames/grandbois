import GameState from './GameState'
import GameView from './GameView'
import PlacedTile from './material/PlacedTile'
import {Bear, Clearing, Space, Tower} from './material/Tile'
import {tiles} from './material/Tiles'

type ForestView = Map<number, Map<number, Space>>

export default ForestView

export function getForestView(game: GameState | GameView) {
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
    player.towersPosition.forEach(towerPosition => forestView.get(towerPosition.x)!.set(towerPosition.y, Tower))
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

export const mod = (n: number, m: number) => ((n % m) + m) % m
