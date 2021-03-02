import {css} from '@emotion/core'
import GameView from '@gamepark/grandbois/GameView'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import Player from '@gamepark/grandbois/Player'
import {usePlayerId} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import React, {FunctionComponent, useMemo, useRef} from 'react'
import ReactTooltip from 'react-tooltip'
import ClanCard from './clans/ClanCard'
import PlayerPanel from './players/PlayerPanel'
import ScorePanel from './players/ScorePanel'
import DrawPile from './tiles/DrawPile'
import Forest from './tiles/Forest'
import River from './tiles/River'
import TutorialPopup from './tutorial/TutorialPopup'
import {cardStyle, cardWidth, fadeIn} from './util/Styles'
import {useBellAlert} from './util/useBellAlert'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.find(player => player.tower === playerId) as Player | undefined
  const gameWasLive = useRef(!game.over)
  useBellAlert(game)
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      { !game.over && <River game={game} />}
      <Forest game={game}/>
      { !game.over &&  player?.clans.map( (clan,index) =>
        <ClanCard css={[cardStyle,clanStyle(index)]} game={game} key={index} clan={clan} showScore={game.over} tower={player!.tower} />
      )}
      {players.map((player, index) =>
        <PlayerPanel game={game} key={index} player={player} position={index} highlight={player.tower === game.activePlayer}  showScore={game.over} />
      )}
      {game.over && <ScorePanel game={game} animation={gameWasLive.current}/>}
      {game.tutorial && <TutorialPopup game={game}/>}
      <ReactTooltip css={css`font-size:2em;`} type='info' effect='solid' place='right' backgroundColor='green' globalEventOff='mousedown' />
    </Letterbox>
  )
}

export const getPlayersStartingWith = (game: GameView, playerId?: TowerColor) => {
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.tower === playerId)
    return [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  } else {
    return game.players
  }
}

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`
const clanStyle = (index:number) => css`
  bottom: 1%;
  right: ${1 + index * ( 1 + cardWidth )}%;
  z-index: ${3 - index} ;
`

export default GameDisplay