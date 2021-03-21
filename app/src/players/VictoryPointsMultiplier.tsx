/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clan from '@gamepark/grandbois/material/Clan'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import {TFunction} from 'i18next'
import {FC, HTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import {towerImage} from '../clans/TowerInfo'
import Images from '../material/Images'

type Props = {
  item: number
  clans: Clan[]
  tower:TowerColor
  multiplier: number
  legend?:boolean
} & HTMLAttributes<HTMLDivElement>

const VictoryPointsMultiplier: FC<Props> = ({item, clans, tower, multiplier, legend,...props}) => {
  const {t} = useTranslation()
  return <>
    { clans.map( (clan,index) =>
      <div {...props} key={index} css={style} data-tip={getScoreTypeDescription(t, item)}>
        <span css={numberStyle}>{multiplier}</span><span css={multiplierStyle}>x</span>
        <img src={scoreIcons[item][clan]} css={clanIconStyle} alt={getScoreTypeDescription(t, item)}/>
        { item > 1 && <img src={towerImage[tower]} css={towerIconStyle} alt={getScoreTypeDescription(t, item)} />}
        { legend && <span css={legendStyle}>{getScoreTypeDescription(t, item)}</span>}
      </div>
    )}
  </>
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
      return t('1 point for each of your Clan’s spaces')
    case 1:
      return t('2 points per space for the largest group of your Clan’s spaces')
    case 2:
      return t('2 points for each of your Clan’s spaces around your Watchtower')
    default:
      return t('1 point for each of another Clan’s spaces around your Watchtower')
  }
}

export default VictoryPointsMultiplier