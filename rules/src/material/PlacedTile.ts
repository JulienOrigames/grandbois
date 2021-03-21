import {mod} from '../ForestView'

type PlacedTile = {
  tile: number
  x : number
  y: number
  rotation : number
}

export function isPlacedTile(tile:Object) : tile is PlacedTile{
  const placedTile = tile as PlacedTile
  return placedTile.x !== undefined && placedTile.y !== undefined && placedTile.rotation !== undefined
}

export default PlacedTile

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