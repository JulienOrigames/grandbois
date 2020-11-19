import {css} from '@emotion/core'
import {GameSpeed, useOptions, usePlayer, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {endPlayerPanelHeight, endPlayerPanelY, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY} from '../util/Styles'
import Timer from './Timer'
import TowerColor from '../clans/TowerColor'
import {getTowerName, towerImage} from '../clans/TowerInfo'

type Props = {
  player: Player | PlayerView
  position: number
  highlight: boolean
  showScore: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerPanel: FunctionComponent<Props> = ({player, position, highlight, showScore, ...props}) => {
  const {t} = useTranslation()
  const options = useOptions()
  const playerInfo = usePlayer<TowerColor>(player.tower)
  const playerID = usePlayerId<TowerColor>()
  return (
    <div css={style(player.tower, position, highlight, showScore)} {...props}>
      <img alt={getTowerName(t, player.tower)} src={towerImage[player.tower]} css={towerStyle(player.towerPosition!==undefined)} draggable="false"/>
      <h3 css={[titleStyle(showScore), player.eliminated && eliminatedStyle]}>
        <span css={nameStyle}>{ player.tower === playerID ? t('Vous') : ( playerInfo?.name || getTowerName(t, player.tower) )}</span>
        {options?.speed === GameSpeed.RealTime && playerInfo?.time?.playing && <Timer time={playerInfo.time}/>}
      </h3>
    </div>
  )
}

const style = (tower: TowerColor, position: number, highlight: boolean, showScore:boolean) => css`
  position: absolute;
  z-index: 2;
  top: ${showScore?endPlayerPanelY(position):playerPanelY(position)}%;
  right: ${playerPanelRightMargin}%;
  width: ${playerPanelWidth}%;
  height: ${showScore?endPlayerPanelHeight:playerPanelHeight}%;
  border-radius: 5px;
  ${borderStyle(highlight)};
  
  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2em solid #ffd700;
  box-shadow: 0.2em 0.2em 1em gold;
` : css`
  border: 0.2em solid lightslategrey;
  box-shadow: 0.2em 0.2em 1em black;
`

const towerStyle = (towerPlayed:boolean) => css`
  position: absolute;
  height: 90%;
  top: 5%;
  left: 1%;
  opacity:${towerPlayed?'0.5':'1'};
`

const titleStyle = (showScore:boolean) => css`
  color: #333333;
  position: absolute;
  top: 5%;
  left: ${showScore?'25':'20'}%;
  right: 2%;
  height: 90%;
  margin: 0;
  font-size: 2em;
  line-height: 3em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const eliminatedStyle = css`
  text-decoration: line-through;
`

export default PlayerPanel