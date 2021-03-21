/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/grandbois/GameView'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import {usePlayerId} from '@gamepark/react-client'
import {FC, HTMLAttributes, useMemo, useState} from 'react'
import {getPlayersStartingWith} from '../GameDisplay'
import PlayerScore from './PlayerScore'

type Props = { game: GameView, animation: boolean } & HTMLAttributes<HTMLDivElement>

const ScorePanel: FC<Props> = ({game, animation}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayScore, setDisplayScore] = useState(true)
  return (
    <div css={[scorePanelStyle,!displayScore && shortPanelWidth]}>
      {players.map((player, index) =>
        <PlayerScore key={player.tower} position={index} game={game} player={player} displayScore={displayScore} setDisplayScore={setDisplayScore} animation={animation}/>
      )}
    </div>
  )
}

const scorePanelStyle = css`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: 8.5%;
  right: 20.6%;
  min-width: 50%;
  height: 90%;
  z-index: 5;   
  overflow: hidden;
  transition: min-width 0.5s ease-in;
  pointer-events: none;
`

const shortPanelWidth = css`
  min-width: 14%;
`

export default ScorePanel