import TowerColor from '../material/TowerColor'
import MoveType from './MoveType'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: TowerColor
}

export function concede(playerId: TowerColor): Concede {
  return {type: MoveType.Concede, playerId}
}
