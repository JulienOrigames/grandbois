import TowerColor from '../clans/TowerColor'
import Clan from '../clans/Clan'


type Player = {
  tower: TowerColor
  clan : Clan
  eliminated?: number
}

export default Player