import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../material/Images'
import Clan from '../clans/Clan'
import TowerColor from '../clans/TowerColor'
import {towerImage} from '../clans/TowerInfo'

type Props = {
  item: number
  clan: Clan
  tower:TowerColor
  multiplier: number
  legend?:boolean
} & React.HTMLAttributes<HTMLDivElement>

const VictoryPointsMultiplier: FunctionComponent<Props> = ({item, clan, tower, multiplier, legend,...props}) => {
  const {t} = useTranslation()
  return (
    <div {...props} css={style} data-tip={getScoreTypeDescription(t, item)}>
      <span css={numberStyle}>{multiplier}</span><span css={multiplierStyle}>x</span>
      <img src={scoreIcons[item][clan]} css={clanIconStyle} alt={getScoreTypeDescription(t, item)}/>
      { item > 1 && <img src={towerImage[tower]} css={towerIconStyle} alt={getScoreTypeDescription(t, item)} />}
      { legend && <span css={legendStyle}>{getScoreTypeDescription(t, item)}</span>}
    </div>
  )
}

const style = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.01em black;
  font-size: 3em;
`

const legendStyle = css`
  color: #000;
  font-size: 0.5em;
  text-shadow: none;
  margin: 0 3%;
`

const clanIcon = {
  [Clan.Toad]: Images.iconToad,
  [Clan.Lizard]: Images.iconLizard,
  [Clan.Rabbit]: Images.iconRabbit,
  [Clan.Raccoon]: Images.iconRaccoon,
  [Clan.Fox]: Images.iconFox
}

const clanIcons = {
  [Clan.Toad]: Images.iconToads,
  [Clan.Lizard]: Images.iconLizards,
  [Clan.Rabbit]: Images.iconRabbits,
  [Clan.Raccoon]: Images.iconRaccoons,
  [Clan.Fox]: Images.iconFoxes
}

const clanTower = {
  [Clan.Toad]: Images.iconToadsTower,
  [Clan.Lizard]: Images.iconLizardsTower,
  [Clan.Rabbit]: Images.iconRabbitsTower,
  [Clan.Raccoon]: Images.iconRaccoonsTower,
  [Clan.Fox]: Images.iconFoxesTower
}

const clanTowerOthers = {
  [Clan.Toad]: Images.iconToadOthers,
  [Clan.Lizard]: Images.iconLizardOthers,
  [Clan.Rabbit]: Images.iconRabbitOthers,
  [Clan.Raccoon]: Images.iconRaccoonOthers,
  [Clan.Fox]: Images.iconFoxOthers
}

const scoreIcons = [clanIcon, clanIcons, clanTower, clanTowerOthers]

const numberStyle = css`
  text-align: center;
  flex-shrink: 0;
  width: 1em;
  filter: drop-shadow(0 0 1px black);
`

const multiplierStyle = css`
  z-index: 1;
  position: relative;
  filter: drop-shadow(0 0 1px black);
`

const clanIconStyle = css`
  height: 80%;
  border-radius: 0.5em;
  margin-left:0.2em;
  filter: drop-shadow(0 0 1px black);
`

const towerIconStyle = css`
  height: 90%;
`

const getScoreTypeDescription = (t: TFunction, item: number) => {
  switch (item) {
    case 0:
      return t('1 point par case de son clan')
    case 1:
      return t('2 points par case de la plus grande zone de son clan')
    case 2:
      return t('2 points par case de son clan autour de sa tour de garde')
    default:
      return t('1 point par case d’autres clans autour de sa tour de garde')
  }
}

export default VictoryPointsMultiplier