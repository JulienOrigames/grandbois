import TowerColor from '../clans/TowerColor'
import Clan from '../clans/Clan'

type Player = {
  tower: TowerColor
  towerPosition? : {x:number,y:number} // TODO : two player rules
  clan : Clan
  eliminated?: number
}

export default Player