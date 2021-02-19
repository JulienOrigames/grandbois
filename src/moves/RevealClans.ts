import MoveType from './MoveType'
import TowerColor from '../clans/TowerColor'
import Clan from '../clans/Clan'

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