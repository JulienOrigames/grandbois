/** @jsxImportSource @emotion/react */
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import Player from '@gamepark/grandbois/Player'
import PlayerView from '@gamepark/grandbois/PlayerView'
import {FC, HTMLAttributes} from 'react'
import Images from '../material/Images'

type Props = {
  player: Player | PlayerView
  gameOver: boolean
  withResourceDrop?: boolean
} & HTMLAttributes<HTMLDivElement>

const TowerInfo: FC<Props> = ({player, gameOver, withResourceDrop = false, ...props}) => {
  return <></>
}

export const towerImage = {
  [TowerColor.Brown]: Images.brownTower,
  [TowerColor.Black]: Images.blackTower,
  [TowerColor.Blue]: Images.blueTower,
  [TowerColor.White]: Images.whiteTower
}

export default TowerInfo