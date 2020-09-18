import {css} from '@emotion/core'
import {usePlay, usePlayerId, usePlayers} from '@interlude-games/workshop'
import Animation from '@interlude-games/workshop/dist/Types/Animation'
import PlayerInfo from '@interlude-games/workshop/dist/Types/Player'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import MainMenu from './MainMenu'
import TowerColor from './clans/TowerColor'
import Move from './moves/Move'
import {isOver} from './Rules'
import Theme, {LightTheme} from './Theme'
import GameView from './types/GameView'
import Player from './types/Player'
import PlayerView from './types/PlayerView'
import {isPlayer} from './types/typeguards'
import {gameOverDelay, headerHeight, textColor} from './util/Styles'
import {getClanName} from './clans/ClanInfo'


const headerStyle = (theme: Theme) => css`
  position: absolute;
  display: flex;
  width: 100%;
  height: ${headerHeight}em;
  padding: 0 30em 0 0;
  text-align: center;
  background-color: ${theme.color === LightTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 30, 0.5)'};
  transition: background-color 1s ease-in;
`

const bufferArea = css`
  width: 30em;
  flex-shrink: 1;
`

const textStyle = css`
  flex-grow: 1;
  flex-shrink: 0;
  transition: color 1s ease-in;
  padding: 0.25em;
  margin: 0;
  line-height: 1.25;
  font-size: 4em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

type Props = {
  game?: GameView
  loading: boolean
}

const Header: FunctionComponent<Props> = ({game, loading}) => {
  const clan = usePlayerId<TowerColor>()
  const play = usePlay<Move>()
  const players = usePlayers<TowerColor>()
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const gameOver = game !== undefined && isOver(game)
  const [scoreSuspense, setScoreSuspense] = useState(false)
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => setScoreSuspense(false), gameOverDelay * 1000)
    } else if (game) {
      setScoreSuspense(true)
    }
  }, [game, gameOver, setScoreSuspense])
  const text = loading ? t('Chargement de la partie...') :
    gameOver && scoreSuspense ? t('Calcul du score...') :
      getText(t, play, players, game!, clan)
  return (
    <header css={headerStyle(theme)}>
      <div css={bufferArea}/>
      <h1 css={[textStyle, textColor(theme)]}>{text}</h1>
      <MainMenu/>
    </header>
  )
}

function getText(t: TFunction, play: (move: Move) => void, playersInfo: PlayerInfo<TowerColor>[], game: GameView, clan?: TowerColor, animation?: Animation<Move>) {
  const player = game.players.find(player => player.tower === clan)
  const getPlayerName = (clan: TowerColor) => playersInfo.find(p => p.id === clan)?.name || getClanName(t, clan)
  if (game.tutorial && !animation && player && isPlayer(player)) {
    const tutorialText = getTutorialText(t, game, player)
    if (tutorialText) {
      return tutorialText
    }
  }
  return t('Début de la partie')
}

function getTutorialText(t: TFunction, game: GameView, player: Player): string | undefined {
  return
}

function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<TowerColor>[], game: GameView, player?: Player | PlayerView) {
  return
}

export default Header