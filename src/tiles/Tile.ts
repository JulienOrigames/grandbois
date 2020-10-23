import Clan from '../clans/Clan'

type Tile = [Space, Space, Space, Space]

export type Space = typeof Clearing | typeof Bear | Troop


export const Clearing = 'Clearing'
export const Bear = 'Bear'

type Troop = {
  clan : Clan
  size : number
}

export default Tile
