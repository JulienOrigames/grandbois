import {Letterbox, usePlay, usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useEffect, useMemo, useState} from 'react'
import GameView from './types/GameView'
import {cardHeight, cardStyle, cardWidth, fadeIn} from './util/Styles'
import {css} from '@emotion/core'
import DrawPile from './tiles/DrawPile'
import River from './tiles/River'
import Forest from './tiles/Forest'
import ClanCard from './clans/ClanCard'
import TowerColor from './clans/TowerColor'
import {getForestView, isLegalTilePosition, isOver} from './Rules'
import PlayerPanel from './players/PlayerPanel'
import PlacedTile from './tiles/PlacedTile'
import Button from './util/Button'
import {useTranslation} from 'react-i18next'
import PlaceForestTile, {placeForestTile} from './moves/PlaceForestTile'
import Player from './types/Player'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  const play = usePlay<PlaceForestTile>()
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.find(player => player.tower === playerId) as Player | undefined
  const gameOver = isOver(game)
  const [playingTile,setPlayingTile] = useState<PlacedTile>()
  useEffect(() => {
    if(playingTile && !game.river.some(tile => tile === playingTile.tile))
      setPlayingTile(undefined)
  }, [game,playingTile])
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      <River game={game} playingTile={playingTile} setPlayingTile={setPlayingTile} />
      <Forest game={game} playingTile={playingTile} setPlayingTile={setPlayingTile} />
      <ClanCard css={[cardStyle,clanStyle]} clan={player?.clan} />
      {players.map((player, index) =>
        <PlayerPanel key={player.tower} player={player} position={index} highlight={player.tower === playerId}  showScore={gameOver} />
      )}
      {playingTile && isLegalTilePosition(getForestView(game.forest),playingTile)
      && <Button css={validStyle} onClick={() => play(placeForestTile(playingTile))}>{t('Valider')}</Button>}
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