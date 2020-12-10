import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import TowerColor from './TowerColor'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import Images from '../material/Images'

type Props = {
  player: Player | PlayerView
  gameOver: boolean
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const TowerInfo: FunctionComponent<Props> = ({player, gameOver, withResourceDrop = false, ...props}) => {
  return <></>
}

export function getTowerName(t: TFunction, tower?: TowerColor) {
  switch (tower) {
    case TowerColor.BlackTower:
      return t('Joueur noir')
    case TowerColor.BlueTower:
      return t('Joueur bleu')
    case TowerColor.BrownTower:
      return t('Joueur marron')
    case TowerColor.WhiteTower:
      return t('Joueur blanc')
    default :
      return t('Joueur')
  }
}

export const towerImage = {
  [TowerColor.BrownTower]: Images.brownTower,
  [TowerColor.BlackTower]: Images.blackTower,
  [TowerColor.BlueTower]: Images.blueTower,
  [TowerColor.WhiteTower]: Images.whiteTower
}

export default TowerInfo