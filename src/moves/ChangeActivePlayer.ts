import MoveType from './MoveType'

type ChangeActivePlayer = {
  type: typeof MoveType.ChangeActivePlayer
}

export function changeActivePlayer(): ChangeActivePlayer {
  return {type: MoveType.ChangeActivePlayer}
}

export default ChangeActivePlayer