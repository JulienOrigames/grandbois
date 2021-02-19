import {css, keyframes} from '@emotion/core'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent, useMemo} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../material/Images'
import {getForestView, getPlayerScores} from '../Rules'
import Theme, {LightTheme} from '../Theme'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {fadeIn, gameOverDelay} from '../util/Styles'
import ScorePart from './ScorePart'
import GameView from '../types/GameView'
import Game from '../types/Game'

type Props = {
  game: Game|GameView
  player: Player | PlayerView
  position: number
  displayScore: boolean
  setDisplayScore: (displayScore: boolean) => void
  animation: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PlayerScore: FunctionComponent<Props> = ({game, player, position, displayScore, setDisplayScore, animation}) => {
  const {t} = useTranslation()
  const forestView = getForestView(game)
  const clans = (player as Player).clans
  const playerScores = useMemo(() => getPlayerScores(clans, player.towersPosition,forestView), [clans, player, forestView])
  const scoreLines = [playerScores.clanPoints,playerScores.greatestClanPoints,playerScores.towerClanPoints,playerScores.towerOtherClansPoints]
  const totalScore = scoreLines.reduce((a, b)=>a+b)
  const scoreMultipliers = [1,2,2,1]
  const theme = useTheme<Theme>()
  const twoPlayersGame = game.players.length === 2
  return (
    <div css={[style, scoreHeight(twoPlayersGame) ,topPosition(position,twoPlayersGame), backgroundStyle(theme), animation && growAnimation, displayScore ? displayPlayerScore : hidePlayerScore]}>
      <button css={[arrowStyle(theme), animation && fadeInAnimation, displayScore ? arrowStandardStyle : arrowReverseStyle]} onClick={() => setDisplayScore(!displayScore)}
              title={displayScore ? t('Réduire les Scores') : t('Afficher les Scores')}/>
      <div css={scorePartStyle}>
        { scoreLines.map( (score, index) => <ScorePart key={index} game={game} player={player} item={index} multiplier={scoreMultipliers[index]} score={score}/> ) }
      </div>
      <div css={[scoreStyle, animation && fadeInAnimation, displayScore ? displayScoreStyle : hideScoreStyle, totalScore !== 0 && displayScore && equalSign]}>{totalScore}</div>
    </div>
  )
}

const style = css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-radius: 2em 0 0 2em;
  width: auto;
  height: 16.7%;
  overflow: hidden;
  transition: max-width 0.5s linear, background-color 1s ease-in;
  pointer-events: auto;
`

const scoreHeight = (twoPlayersGame: boolean) => css`
  height: ${twoPlayersGame?21.7:16.7}%;
`

const topPosition = (index: number,twoPlayersGame: boolean) => css`
  top: ${twoPlayersGame?(1 + index * 25):(3.5 + index * 25)}%;
`

const backgroundStyle = (theme: Theme) => css`
  background-color: ${theme.color === LightTheme ? 'rgba(0, 0, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`

const revealScore = keyframes`
  from { max-width: 22em; }
  to { max-width: 100%; }
`

const growAnimation = css`
  animation: ${revealScore} ${gameOverDelay}s linear;
`

const displayPlayerScore = css`
  max-width: 100%;
`

const hidePlayerScore = css`
  max-width: 24em;
`

const arrowStyle = (theme: Theme) => css`
  flex-shrink: 0;
  position: relative;
  max-height: 100%;
  background-image: url(${theme.color === LightTheme ? Images.arrowWhite : Images.arrowOrange});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  z-index: 6;
  &:focus {
    outline: 0;
  }
  &:hover {
    cursor: pointer;
  }
  transition: all 0.5s linear;
`

const fadeInAnimation = css`
  opacity: 0;
  animation: ${fadeIn} ${gameOverDelay/3}s ${gameOverDelay*2/3}s ease-in forwards;
`

const arrowStandardStyle = css`
  width: 8em;
  height: 10em;
`

const arrowReverseStyle = css`
  transform: scaleX(-1);
  width: 5em;
  height: 7em;
`

const scoreStyle = css`
  flex-shrink: 0;
  font-size: 6em;
  font-weight: bold;
  line-height: 1.5em;
  color: white;
  text-shadow: 0 0 0.1em black;
  width: 2.9em;
  height: 1.67em;
  text-align: center;
  transition: margin 0.5s linear;
  padding-right:1em;
  position:relative;
  &:after {
    content:'';
    background-image: url(${Images.scoreIcon});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;
    filter: drop-shadow(0.05em 0.05em 0.1em black);
    width: 1em;
    height: 1em;
    position:absolute;
    right:0;
    top:15%;
  }
`

const displayScoreStyle = css`
  margin: 0 0.2em 0 0.8em;
`

const hideScoreStyle = css`
  margin: 0 0.2em 0 0;
`

const equalSign = css`
  &:before {
    content: '=';
    position: absolute;
    right: 110%;
    top: 50%;
    transform: translateY(-50%);
  }
`

const scorePartStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  overflow:hidden;
  height:100%; 
`


export default PlayerScore