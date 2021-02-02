import {css} from '@emotion/core'
import {GameSpeed, useOptions, usePlayer, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import ClanCard from '../clans/ClanCard'
import TowerColor from '../clans/TowerColor'
import {towerImage} from '../clans/TowerInfo'
import {getPlayersStartingWith} from '../GameDisplay'
import Rules from '../Rules'
import GameView from '../types/GameView'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {
  endPlayerPanelHeight, endPlayerPanelY, fadeIn, playerPanelHeight, playerPanelRightMargin, playerPanelWidth, playerPanelY, screenRatio
} from '../util/Styles'
import Timer from './Timer'

type Props = {
  game: GameView
  player: Player | PlayerView
  position: number
  highlight: boolean
  showScore: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerPanel: FunctionComponent<Props> = ({game, player, position, highlight, showScore, ...props}) => {
  const {t} = useTranslation()
  const options = useOptions()
  const playerInfo = usePlayer<TowerColor>(player.tower)
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const currentPlayer = players.find(item => item.tower === player.tower) as Player | undefined
  return (
    <div css={[style(player.tower, position, highlight),showScore && endStyle(position)]} {...props}>
      <img alt={Rules.getPlayerName(player.tower, t)} src={towerImage[player.tower]} css={towerStyle(player.towerPosition!==undefined && !game.over)} draggable="false"/>
      <h3 css={[titleStyle(showScore), player.eliminated && eliminatedStyle]}>
        <span css={nameStyle}>{ player.tower === playerId ? t('Vous') : ( playerInfo?.name || Rules.getPlayerName(player.tower, t) )}</span>
        {options?.speed === GameSpeed.RealTime && playerInfo?.time?.playing && <Timer time={playerInfo.time}/>}
      </h3>
      {game.over && <ClanCard css={clanStyle} game={game} clan={currentPlayer?.clan} showScore={game.over} tower={player.tower} /> }
    </div>
  )
}

const style = (tower: TowerColor, position: number, highlight: boolean) => css`
  position: absolute;
  z-index: 2;
  top: ${playerPanelY(position)}%;
  right: ${playerPanelRightMargin}%;
  width: ${playerPanelWidth}%;
  height: ${playerPanelHeight}%;
  border-radius: 5px;
  ${borderStyle(highlight)};
  transition: height 1s ease-in, top 1s ease-in;
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

const endStyle = (position: number) => css`
  top: ${endPlayerPanelY(position)}%;
  height: ${endPlayerPanelHeight}%;
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
  bottom: 1%;
  left: 1%;
  opacity:${towerPlayed?'0.5':'1'};
`

const titleStyle = (showScore:boolean) => css`
  color: #333333;
  position: absolute;
  top: ${showScore?'3':'5'}%;
  left: ${showScore?'25':'20'}%;
  right: 2%;
  height: ${showScore?'20':'90'}%;
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

const clanStyle = css`
  position: absolute;
  height : 70%;
  width : ${70 * endPlayerPanelHeight / playerPanelWidth / screenRatio }%;
  top: 25%;
  left: 50%;
  z-index:2;
  animation: ${fadeIn} 5s ease-in forwards;
`

export default PlayerPanel