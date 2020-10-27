import Clan from '../clans/Clan'

type Tile = [Space, Space, Space, Space]

export type Space = typeof Clearing | typeof Bear | Troop | typeof Tower


export const Clearing = 'Clearing'
export const Bear = 'Bear'
export const Tower = 'Tower'

type Troop = {
  clan : Clan
  size : number
}

export default Tile
