export const draggedTile = 'Tile'

type DraggedTile = {
  type : typeof draggedTile
  tile: number
  x?:number
  y?:number
  rotation?:number
}

export default DraggedTile