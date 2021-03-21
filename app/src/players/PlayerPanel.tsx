/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/grandbois/GameView'
import {getPlayerName} from '@gamepark/grandbois/GrandboisOptions'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import Player from '@gamepark/grandbois/Player'
import PlayerView from '@gamepark/grandbois/PlayerView'
import {GameSpeed, useOptions, usePlayer, usePlayerId} from '@gamepark/react-client'
import {FC, HTMLAttributes, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import ClanCard from '../clans/ClanCard'
import {towerImage} from '../clans/TowerInfo'
import {getPlayersStartingWith} from '../GameDisplay'
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
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel: FC<Props> = ({game, player, position, highlight, showScore, ...props}) => {
  const {t} = useTranslation()
  const options = useOptions()
  const playerInfo = usePlayer<TowerColor>(player.tower)
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const currentPlayer = players.find(item => item.tower === player.tower) as Player | undefined
  const twoPlayersGame = game.players.length === 2
  return (
    <div css={[style(position, highlight), (showScore || twoPlayersGame) && endStyle(position)]} {...props}>
      <div css={towersStyle(twoPlayersGame || game.over)}>
      {
        ( twoPlayersGame && !game.over ) ?
            <>
            <img alt={getPlayerName(player.tower, t)} src={towerImage[player.tower]}
                 css={towerStyle(player.towersPosition[0] !== undefined && !game.over)} draggable="false"/>
            <img alt={getPlayerName(player.tower, t)} src={towerImage[player.tower]}
                 css={towerStyle(player.towersPosition[1] !== undefined && !game.over)} draggable="false"/>
            </>
          :
            <img alt={getPlayerName(player.tower, t)} src={towerImage[player.tower]} css={towerStyle(player.towersPosition[0] !== undefined && !game.over)}
               draggable="false"/>
      }
      </div>
      <h3 css={[titleStyle(showScore || twoPlayersGame), player.eliminated && eliminatedStyle]}>
        <span css={nameStyle}>{player.tower === playerId ? t('You') : (playerInfo?.name || getPlayerName(player.tower, t))}</span>
        {options?.speed === GameSpeed.RealTime && playerInfo?.time?.playing && <Timer time={playerInfo.time}/>}
      </h3>
      {game.over && currentPlayer?.clans.map((clan, index) =>
        <ClanCard key={clan} css={clanStyle(index,twoPlayersGame)} game={game} clan={clan} showScore={game.over} tower={player.tower}/>
      )}
    </div>
  )
}

const style = (position: number, highlight: boolean) => css`
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

const towersStyle = (notFullHeight:boolean) => css`
  position: absolute;
  height: ${notFullHeight?90:100}%;
  width: auto;
  bottom: 1%;
  left: 1%;
`

const towerStyle = (towerPlayed: boolean) => css`
  opacity: ${towerPlayed ? '0.5' : '1'};
  position: relative;
  height: 100%;
  width: auto;
`

const titleStyle = (showScore: boolean) => css`
  color: #333333;
  position: absolute;
  top: ${showScore ? '3' : '5'}%;
  left: ${showScore ? '25' : '20'}%;
  right: 2%;
  height: ${showScore ? '18' : '90'}%;
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

const clanCardWidth = 70 * endPlayerPanelHeight / playerPanelWidth / screenRatio

const clanStyle = (index: number,twoPlayersGame:boolean) => css`
  position: absolute;
  height: 70%;
  width: ${twoPlayersGame?clanCardWidth*0.7:clanCardWidth}%;
  top: 25%;
  left: ${twoPlayersGame? index * clanCardWidth * 0.7  + 40 : 50}%;
  z-index: 2;
  animation: ${fadeIn} 5s ease-in forwards;
`

export default PlayerPanel