import MoveType from './MoveType'
import TowerColor from '../clans/TowerColor'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: TowerColor
}

export function concede(playerId: TowerColor): Concede {
  return {type: MoveType.Concede, playerId}
}
