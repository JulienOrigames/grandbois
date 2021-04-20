/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/grandbois/GameView'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import {isPlayer} from '@gamepark/grandbois/PlayerView'
import {usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import {FC, useMemo, useRef} from 'react'
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

const GameDisplay: FC<{ game: GameView }> = ({game}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const player = players.filter(isPlayer).find(player => player.tower === playerId)
  const gameWasLive = useRef(!game.over)
  const tutorial = useTutorial()
  useBellAlert(game)
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
      {!game.over && <River game={game}/>}
      <Forest game={game}/>
      {!game.over && player && player.clans.map((clan, index) =>
        <ClanCard css={[cardStyle, clanStyle(index)]} game={game} key={index} clan={clan} showScore={game.over} tower={player!.tower}/>
      )}
      {players.map((player, index) =>
        <PlayerPanel game={game} key={index} player={player} position={index} highlight={player.tower === game.activePlayer} showScore={game.over}/>
      )}
      {game.over && <ScorePanel game={game} animation={gameWasLive.current}/>}
      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}
      <ReactTooltip css={css`font-size: 2em;`} type='info' effect='solid' place='right' backgroundColor='green' globalEventOff='mousedown'/>
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
const clanStyle = (index: number) => css`
  bottom: 1%;
  right: ${1 + index * (1 + cardWidth)}%;
  z-index: ${3 - index};
`

export default GameDisplay