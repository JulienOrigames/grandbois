import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import TowerColor from './TowerColor'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'

type Props = {
  player: Player | PlayerView
  gameOver: boolean
  withResourceDrop?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const ClanInfo: FunctionComponent<Props> = ({player, gameOver, withResourceDrop = false, ...props}) => {
  return <></>
}

export function getClanName(t: TFunction, clan: TowerColor) {
  switch (clan) {
    case TowerColor.BlackTower:
      return t('Tour de garde noire')
    case TowerColor.BlueTower:
      return t('Tour de garde bleue')
    case TowerColor.BrownTower:
      return t('Tour de garde marron')
    case TowerColor.WhiteTower:
      return t('Tour de garde blanche')
  }
}

export default ClanInfo