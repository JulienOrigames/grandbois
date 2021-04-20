import GameView from '@gamepark/grandbois/GameView'
import {XYCoord} from 'react-dnd'

export const MOVE_FOREST = 'MoveForest'

type MoveForest = {
  type: typeof MOVE_FOREST
  offset: XYCoord
}

export default MoveForest

export const moveForestMove = (offset: XYCoord) => ({type: MOVE_FOREST, offset})

export function moveForest(state: GameView, move: MoveForest) {
  state.forestCenter = {x: (state.forestCenter?.x ?? 0) + move.offset.x, y: (state.forestCenter?.y ?? 0) + move.offset.y}
}