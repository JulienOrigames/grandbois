/** @jsxImportSource @emotion/react */
import {getForestView} from '@gamepark/grandbois/ForestView'
import GameView from '@gamepark/grandbois/GameView'
import {getPlayerScores} from '@gamepark/grandbois/Grandbois'
import {getPlayerName} from '@gamepark/grandbois/GrandboisOptions'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import Player from '@gamepark/grandbois/Player'
import PlayerView, {isPlayer} from '@gamepark/grandbois/PlayerView'
import {Tutorial, useGame, usePlay, usePlayerId, usePlayers, useTutorial} from '@gamepark/react-client'
import PlayerInfo from '@gamepark/react-client/dist/Types/Player'
import {TFunction} from 'i18next'
import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import Move from '../../rules/src/moves/Move'
import {gameOverDelay} from './util/Styles'

type Props = {
  loading: boolean
}

const HeaderText: FC<Props> = ({loading}) => {
  const game = useGame<GameView>()
  const tower = usePlayerId<TowerColor>()
  const play = usePlay<Move>()
  const players = usePlayers<TowerColor>()
  const {t} = useTranslation()
  const tutorial = useTutorial()
  const gameOver = game !== undefined && game.over
  const [scoreSuspense, setScoreSuspense] = useState(false)
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => setScoreSuspense(false), gameOverDelay * 1000)
    } else if (game) {
      setScoreSuspense(true)
    }
  }, [game, gameOver, setScoreSuspense])
  const text = loading ? t('Game loading...') :
    gameOver && scoreSuspense ? t('Score calculation…') :
      getText(t, play, players, game!, tower, tutorial || undefined)
  return <>{text}</>
}

function getText(t: TFunction, play: (move: Move) => void, playersInfo: PlayerInfo<TowerColor>[], game: GameView, tower?: TowerColor, tutorial?: Tutorial) {
  const player = game.players.find(player => player.tower === tower)
  if (tutorial && player && isPlayer(player)) {
    const tutorialText = getTutorialText(t, game, player)
    if (tutorialText){
      return tutorialText
    }
  }
  if (!game.activePlayer)  return getEndOfGameText(t, playersInfo, game, player)
  if( tower === game.activePlayer){
      return t('You must choose a tile in the river and place it in the forest')
  }
  else {
    const activePlayerName = playersInfo.find(p => p.id === game.activePlayer)?.name || getPlayerName(game.activePlayer, t)
      return t('{player} must place a tile in the forest', {player: activePlayerName})
  }
}

function getTutorialText(t: TFunction, game: GameView, player: Player): string | undefined {
  return
}

function getEndOfGameText(t: TFunction, playersInfo: PlayerInfo<TowerColor>[], game: GameView, player?: Player | PlayerView) {
  const getName = (tower: TowerColor) => playersInfo.find(p => p.id === tower)?.name || getPlayerName(tower, t)
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
      return t('Victory! You win the game with {score} points', {score: highestScore})
    } else {
      return t('{player} wins the game with {score} points', {player: getName(playersWithHighestScore[0].tower), score: highestScore})
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
      return t('Victory! You win the game with {score} points and {spaces} Clan spaces',
        {score: highestScore, spaces: highestClans})
    } else {
      return t('{player} wins the game with {score} points and {spaces} Clan spaces',
        {player: getName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans})
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
      return t('Victory! You win the game with {score} points, {spaces} Clan spaces and a largest group of {zone} spaces',
        {score: highestScore, spaces: highestClans, zone: greatestClans})
    } else {
      return t('{player} wins the game with {score} points, {spaces} Clan spaces and a largest group of {zone} spaces',
        {player: getName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans})
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
      return t('Victory! You win the game with {score} points, {spaces} Clan spaces, a largest group of {zone} spaces and {tower} spaces near your Watchtower',
        {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans })
    } else {
      return t('{player} wins the game with {score} points, {spaces} Clan spaces and a largest group of {zone} spaces and {tower} spaces near your Watchtower',
        {player: getName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans})
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
      return t('Victory! You win the game with {score} points, {spaces} Clan spaces, a largest group of {zone} spaces, {tower} spaces near your Watchtower and {otherTower} other clans near your Watchtower',
        {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans })
    } else {
      return t('{player} wins the game with {score} points, {spaces} Clan spaces and a largest group of {zone} spaces, {tower} spaces near your Watchtower and {otherTower} other clans near your Watchtower',
        {player: getName(playersWithHighestClans[0].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans})
    }
  }
  if (playersWithTowerOtherClans.length === game.players.length) {
    return t('Perfect tie! All players each have {score} points, {spaces} Clan spaces, a largest group of {zone} spaces, {tower} spaces near their Watchtower and {otherTower} other clans near their Watchtower',
      {score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans })
  } else if (playersWithTowerOtherClans.length === 2) {
    return t('Perfect tie! {player1} and {player2} each have {score} points, {spaces} Clan spaces, a largest group of {zone} spaces, {tower} spaces near their Watchtower and {otherTower} other clans near their Watchtower',
      {
        player1: getName(playersWithTowerOtherClans[0].tower), player2: getName(playersWithTowerOtherClans[1].tower),
        score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  } else if (playersWithTowerOtherClans.length === 3) {
    return t('Perfect tie! {player1}, {player2} and {player3} each have {score} points, {spaces} Clan spaces, a largest group of {zone} spaces, {tower} spaces near their Watchtower and {otherTower} other clans near their Watchtower',
      {
        player1: getName(playersWithTowerOtherClans[0].tower), player2: getName(playersWithTowerOtherClans[1].tower),
        player3: getName(playersWithTowerOtherClans[2].tower), score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  } else {
    return t('Perfect tie! {player1}, {player2}, {player3} and {player4} each have {score} points, {spaces} Clan spaces, a largest group of {zone} spaces, {tower} spaces near their Watchtower and {otherTower} other clans near their Watchtower',
      {
        player1: getName(playersWithTowerOtherClans[0].tower), player2: getName(playersWithTowerOtherClans[1].tower),
        player3: getName(playersWithTowerOtherClans[2].tower), player4: getName(playersWithTowerOtherClans[3].tower),
        score: highestScore, spaces: highestClans, zone: greatestClans, tower: towerClans, otherTower: towerOtherClans
      })
  }
}

export default HeaderText