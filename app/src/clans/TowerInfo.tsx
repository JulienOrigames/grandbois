import React, {FunctionComponent} from 'react'
import Images from '../material/Images'
import Player from '@gamepark/grandbois/Player'
import PlayerView from '@gamepark/grandbois/PlayerView'
import TowerColor from '@gamepark/grandbois/material/TowerColor'

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