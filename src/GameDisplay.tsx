import {Letterbox, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useMemo, useRef} from 'react'
import GameView from './types/GameView'
import {cardStyle, fadeIn} from './util/Styles'
import {css} from '@emotion/core'
import DrawPile from './tiles/DrawPile'
import River from './tiles/River'
import Forest from './tiles/Forest'
import ClanCard from './clans/ClanCard'
import TowerColor from './clans/TowerColor'
import PlayerPanel from './players/PlayerPanel'
import Player from './types/Player'
import ScorePanel from './players/ScorePanel'
import ReactTooltip from 'react-tooltip'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.find(player => player.tower === playerId) as Player | undefined
  const gameWasLive = useRef(!game.over)
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      { !game.over && <River game={game} />}
      <Forest game={game}/>
      { !game.over && <ClanCard css={[cardStyle,clanStyle]} game={game} clan={player?.clan} showScore={game.over} tower={player!.tower} />}
      {players.map((player, index) =>
        <PlayerPanel game={game} key={player.tower} player={player} position={index} highlight={player.tower === game.activePlayer}  showScore={game.over} />
      )}
      {game.over && <ScorePanel game={game} animation={gameWasLive.current}/>}
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
const clanStyle = css`
  bottom: 1%;
  right: 1%;
  z-index:2;
`

export default GameDisplay