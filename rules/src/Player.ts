import TowerColor from './material/TowerColor'
import Clan from './material/Clan'

type Player = {
  tower : TowerColor
  towersPosition : {x:number,y:number}[]
  clans : Clan[]
  eliminated?: number
}

export default Player