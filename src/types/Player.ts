import TowerColor from '../clans/TowerColor'
import Clan from '../clans/Clan'

type Player = {
  tower : TowerColor
  towersPosition : {x:number,y:number}[]
  clans : Clan[]
  eliminated?: number
}

export default Player