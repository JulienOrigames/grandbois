import Clan from '../material/Clan'
import TowerColor from '../material/TowerColor'
import MoveType from './MoveType'

type RevealClans = { type: typeof MoveType.RevealClans }

export default RevealClans

export type RevealClansView = RevealClans
  & { clans: { [key in TowerColor]?: Clan[] } }

export function revealClans(): RevealClans {
  return {type: MoveType.RevealClans}
}

export function isRevealClansView(move: RevealClans | RevealClansView): move is RevealClansView {
  return (move as RevealClansView).clans !== undefined
}