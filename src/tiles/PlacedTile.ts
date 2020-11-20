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