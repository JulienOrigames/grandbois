import {Letterbox, usePlayerId} from '@interlude-games/workshop'
import React, {FunctionComponent, useMemo, useState} from 'react'
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
import PlacedTile from './tiles/PlacedTile'
import Button from './util/Button'
import {useTranslation} from 'react-i18next'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.find(player => player.tower === playerId)
  const gameOver = isOver(game)
  // TODO : useState pour gérer la tuile en cours de positionnement (setState à passer à la Foret)
  const [playingTile,setPlayingTile] = useState<PlacedTile>()
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      <River game={game} playingTile={playingTile} />
      <Forest game={game} playingTile={playingTile} setPlayingTile={setPlayingTile} />
      <ClanCard css={[cardStyle,clanStyle]} clan={player?.clan} />
      {players.map((player, index) =>
        <PlayerPanel key={player.tower} player={player} position={index} highlight={player.tower === playerId}  showScore={gameOver} />
      )}
      {playingTile && <Button css={validStyle}>{t('Valider')}</Button>}
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

const validStyle = css`
  position:absolute;
  bottom: 30%;
  right: 2%;
  font-size:4em;
`

export default GameDisplay