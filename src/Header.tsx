import {css} from '@emotion/core'
import {usePlay, usePlayerId, usePlayers} from '@gamepark/workshop'
import Animation from '@gamepark/workshop/dist/Types/Animation'
import PlayerInfo from '@gamepark/workshop/dist/Types/Player'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import TowerColor from './clans/TowerColor'
import MainMenu from './MainMenu'
import {changeActivePlayer} from './moves/ChangeActivePlayer'
import Move from './moves/Move'
import {placeTower} from './moves/PlaceTower'
import Rules, {activePlayerCanPlaceTower, getForestView, getPlayerScores} from './Rules'
import Theme, {LightTheme} from './Theme'
import GameView from './types/GameView'
import Player from './types/Player'
import PlayerView from './types/PlayerView'
import {isPlayer} from './types/typeguards'
import Button from './util/Button'
import {gameOverDelay, headerHeight, textColor} from './util/Styles'


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
  const tower = usePlayerId<TowerColor>()
  const play = usePlay<Move>()
  const players = usePlayers<TowerColor>()
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const gameOver = game !== undefined && game.over
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
      getText(t, play, players, game!, tower)
  return (
    <header css={headerStyle(theme)}>
      <div css={bufferArea}/>
      <h1 css={[textStyle, textColor(theme)]}>{text}</h1>
      <MainMenu/>
    </header>
  )
}

function getText(t: TFunction, play: (move: Move) => void, playersInfo: PlayerInfo<TowerColor>[], game: GameView, tower?: TowerColor, animation?: Animation<Move>) {
  const player = game.players.find(player => player.tower === tower)
  if (game.tutorial && !animation && player && isPlayer(player)) {
    const tutorialText = getTutorialText(t, game, player)
    if (tutorialText){
      return tutorialText
    }
  }
  if (!game.activePlayer)  return getEndOfGameText(t, playersInfo, game, player)
  if( tower === game.activePlayer){
    if (activePlayerCanPlaceTower(game))
      return <Trans defaults="Souhaitez-vous placer votre tour de garde ici ? <0>Oui</0> <1>Non</1>"
        components={[<Button onClick={() => play(placeTower())}>Oui</Button>,
                      <Button onClick={() => play(changeActivePlayer())}>Non</Button>]}
              />
    else
      return t('Vous devez choisir une tuile dans la rivière et la placer dans la forêt')
  }
  else {
    const activePlayerName = playersInfo.find(p => p.id === game.activePlayer)?.name || Rules.getPlayerName(game.activePlayer, t)
    if (activePlayerCanPlaceTower(game))
      return t('{player} peut placer sa tour de garde', {player: activePlayerName})
    else
      return t('{player} doit placer une tuile dans la forêt', {player: activePlayerName})
  }
}

function getTutorialText(t: TFunction, game: GameView, player: Player): string | undefined {
  return
}

function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<TowerColor>[], game: GameView, player?: Player | PlayerView) {
  const getPlayerName = (tower: TowerColor) => playersInfo.find(p => p.id === tower)?.name || Rules.getPlayerName(tower, t)
  let highestScore = -1
  let playersWithHighestScore = []
  const forestView = getForestView(game)
  for (const player of game.players) {
    const clans = (player as Player).clans
    const scores = getPlayerScores(clans, player.towersPosition,forestView)
    const score = scores.clanPoints + scores.greatestClanPoints + scores.towerClanPoints + scores.towerOtherClansPoints
    if (score >= highestScore) {
      if (score > highestScore) {
        playersWithHighestScore = []
        highestScore = score
      }
      playersWithHighestScore.push(player)
    }
  }
  if (playersWithHighestScore.length === 1) {
    if (player === playersWithHighestScore[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points', {score: highestScore})
    } else {
      return t('{player} gagne la partie avec {score} points', {player: getPlayerName(playersWithHighestScore[0].tower), score: highestScore})
    }
  }
  let highestClans = -1
  let playersWithHighestClans = []
  for (const player of playersWithHighestScore) {
    const clans = (player as Player).clans
    const scores = getPlayerScores(clans, player.towersPosition,forestView)
    if (scores.clanPoints >= highestClans) {
      if (scores.clanPoints > highestClans) {
        playersWithHighestClans = []
        highestClans = scores.clanPoints
      }
      playersWithHighestClans.push(player)
    }
  }
  if (playersWithHighestClans.length === 1) {
    if (player === playersWithHighestClans[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points et {spaces} cases de Clan',
        {score: highestScore, spaces: highestClans})
    } else {
      return t('{player} gagne la partie avec {score} points et {spaces} cases de Clan',
        {player: getPlayerName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans})
    }
  }
  let greatestClans = -1
  let playersWithGreatestClans = []
  for (const player of playersWithHighestClans) {
    const clans = (player as Player).clans
    const scores = getPlayerScores(clans, player.towersPosition,forestView)
    if (scores.greatestClanPoints >= greatestClans) {
      if (scores.greatestClanPoints > greatestClans) {
        playersWithGreatestClans = []
        greatestClans = scores.greatestClanPoints
      }
      playersWithGreatestClans.push(player)
    }
  }
  if (playersWithGreatestClans.length === 1) {
    if (player === playersWithGreatestClans[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points, {spaces} cases de Clan et un plus grand ensemble de {zone} cases',
        {score: highestScore, spaces: highestClans, zone: greatestClans})
    } else {
      return t('{player} gagne la partie avec {score} points, {spaces} cases de Clan et un plus grand ensemble de {zone} cases',
        {player: getPlayerName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans})
    }
  }
  let towerClans = -1
  let playersWithTowerClans = []
  for (const player of playersWithGreatestClans) {
    const clans = (player as Player).clans
    const scores = getPlayerScores(clans, player.towersPosition,forestView)
    if (scores.towerClanPoints >= towerClans) {
      if (scores.towerClanPoints > towerClans) {
        playersWithTowerClans = []
        towerClans = scores.towerClanPoints
      }
      playersWithTowerClans.push(player)
    }
  }
  if (playersWithTowerClans.length === 1) {
    if (player === playersWithTowerClans[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases et {tower} cases près de votre tour',
        {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans })
    } else {
      return t('{player} gagne la partie avec {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases et {tower} cases près de votre tour',
        {player: getPlayerName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans})
    }
  }
  let towerOtherClans = -1
  let playersWithTowerOtherClans = []
  for (const player of playersWithTowerClans) {
    const clans = (player as Player).clans
    const scores = getPlayerScores(clans, player.towersPosition,forestView)
    if (scores.towerOtherClansPoints >= towerOtherClans) {
      if (scores.towerOtherClansPoints > towerOtherClans) {
        playersWithTowerOtherClans = []
        towerOtherClans = scores.towerOtherClansPoints
      }
      playersWithTowerOtherClans.push(player)
    }
  }
  if (playersWithTowerOtherClans.length === 1) {
    if (player === playersWithTowerOtherClans[0]) {
      return t('Victoire ! Vous gagnez la partie avec {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
        {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans })
    } else {
      return t('{player} gagne la partie avec {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
        {player: getPlayerName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans})
    }
  }
  if (playersWithTowerOtherClans.length === game.players.length) {
    return t('Égalité parfaite ! Tous les joueurs ont {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
      {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans })
  } else if (playersWithTowerOtherClans.length === 2) {
    return t('Égalité parfaite ! {player1} et {player2} ont {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
      {
        player1: getPlayerName(playersWithTowerOtherClans[0].tower), player2: getPlayerName(playersWithTowerOtherClans[1].tower),
        score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  } else if (playersWithTowerOtherClans.length === 3) {
    return t('Égalité parfaite ! {player1}, {player2} et {player3} ont {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
      {
        player1: getPlayerName(playersWithTowerOtherClans[0].tower), player2: getPlayerName(playersWithTowerOtherClans[1].tower),
        player3: getPlayerName(playersWithTowerOtherClans[2].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  } else {
    return t('Égalité parfaite ! {player1}, {player2}, {player3} et {player4} ont {score} points, {spaces} cases de Clan, un plus grand ensemble de {zone} cases, {tower} cases près de votre tour et {otherTower} autres clans près de votre tour',
      {
        player1: getPlayerName(playersWithTowerOtherClans[0].tower), player2: getPlayerName(playersWithTowerOtherClans[1].tower),
        player3: getPlayerName(playersWithTowerOtherClans[2].tower), player4: getPlayerName(playersWithTowerOtherClans[3].tower),
        score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  }
}

export default Header