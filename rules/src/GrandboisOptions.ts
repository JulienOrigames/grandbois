import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import TowerColor, {towerColors} from './material/TowerColor'

export type GrandboisPlayerOptions = {
  id: TowerColor
}

type GrandboisOptions = {
  players: GrandboisPlayerOptions[]
}

export default GrandboisOptions

export function isGrandboisOptions(arg: GameState | GrandboisOptions): arg is GrandboisOptions {
  return typeof (arg as GameState).deck === 'undefined'
}

export const GrandboisOptionsSpec: OptionsSpec<GrandboisOptions> = {
  players: {
    id: {
      label: (t: TFunction) => t('Color'),
      values: towerColors,
      valueLabel: getPlayerName
    }
  }
}

export function getPlayerName(color: TowerColor, t: TFunction) {
  switch (color) {
    case TowerColor.Black:
      return t('Black player')
    case TowerColor.Blue:
      return t('Blue player')
    case TowerColor.Brown:
      return t('Brown player')
    case TowerColor.White:
      return t('White player')
  }
}