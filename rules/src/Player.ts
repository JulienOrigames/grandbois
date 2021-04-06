import Clan from './material/Clan'
import TowerColor from './material/TowerColor'

type Player = {
  tower: TowerColor
  towersPosition: { x: number, y: number }[]
  clans: Clan[]
}

export default Player