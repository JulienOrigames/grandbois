import MoveType from './MoveType'

type PlaceTower = {
  type: typeof MoveType.PlaceTower
}

export function placeTower(): PlaceTower {
  return {type: MoveType.PlaceTower}
}

export default PlaceTower