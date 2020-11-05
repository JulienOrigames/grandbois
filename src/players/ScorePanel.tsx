import {css} from '@emotion/core'
import {usePlayerId} from '@gamepark/workshop'
import React, {FunctionComponent, useMemo, useState} from 'react'
import {getPlayersStartingWith} from '../GameDisplay'
import GameView from '../types/GameView'
import PlayerScore from './PlayerScore'
import TowerColor from '../clans/TowerColor'

type Props = { game: GameView, animation: boolean } & React.HTMLAttributes<HTMLDivElement>

const ScorePanel: FunctionComponent<Props> = ({game, animation}) => {
  const playerId = usePlayerId<TowerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const [displayScore, setDisplayScore] = useState(true)
  return (
    <div css={scorePanelStyle}>
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
  min-width: 69%;
  height: 90%;
  z-index: 5;   
  overflow: hidden;
`

export default ScorePanel