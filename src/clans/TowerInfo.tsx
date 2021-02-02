import React, {FunctionComponent} from 'react'
import Images from '../material/Images'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import TowerColor from './TowerColor'

type Props = {
  player: Player | PlayerView
  gameOver: boolean
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const TowerInfo: FunctionComponent<Props> = ({player, gameOver, withResourceDrop = false, ...props}) => {
  return <></>
}

export const towerImage = {
  [TowerColor.BrownTower]: Images.brownTower,
  [TowerColor.BlackTower]: Images.blackTower,
  [TowerColor.BlueTower]: Images.blueTower,
  [TowerColor.WhiteTower]: Images.whiteTower
}

export default TowerInfo