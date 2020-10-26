import {Letterbox, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useMemo} from 'react'
import GameView from './types/GameView'
import {cardHeight, cardStyle, cardWidth, fadeIn} from './util/Styles'
import {css} from '@emotion/core'
import DrawPile from './tiles/DrawPile'
import River from './tiles/River'
import Forest from './tiles/Forest'
import ClanCard from './clans/ClanCard'
import TowerColor from './clans/TowerColor'
import {isOver} from './Rules'
import PlayerPanel from './players/PlayerPanel'
import Player from './types/Player'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.find(player => player.tower === playerId) as Player | undefined
  const gameOver = isOver(game)
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      <River game={game} />
      <Forest game={game}/>
      <ClanCard css={[cardStyle,clanStyle]} clan={player?.clan} />
      {players.map((player, index) =>
        <PlayerPanel key={player.tower} player={player} position={index} highlight={player.tower === playerId}  showScore={gameOver} />
      )}
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
  bottom: 2%;
  right: 2%;
  height:${cardHeight}%;
  width:${cardWidth}%;
  & > img {
    box-shadow: 0 0 3px black;
  }
`



export default GameDisplay