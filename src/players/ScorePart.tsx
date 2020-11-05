import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  player: Player | PlayerView
  item: number
  multiplier:number
  score:number
} & React.HTMLAttributes<HTMLDivElement>

const ScorePart: FunctionComponent<Props> = ({player, item,multiplier,score}) => {
  const clan = (player as Player).clan
  return (
    <div css={style}>
      <div css={scoreStyle}>{score}</div>
      <VictoryPointsMultiplier css={multiplierStyle} item={item} clan={clan} tower={player.tower} multiplier={multiplier} />
    </div>
  )
}

const style = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  position: relative;
  color: white;
  text-shadow: 0 0 0.3em black;
  &:not(:first-of-type):before {
    content: '+';
    display: block;
    position: absolute;
    right: 85%;
    top: 30%;
    font-size: 5em;
    color: white;
  }
`

const scoreStyle = css`
  font-size: 5em;
  font-weight: bold;
  padding: 0;
  width: 1.7em;
  height: fit-content;
  text-align: center;
  margin-left: 0.8em;
  margin-right: 0.3em;
`

const multiplierStyle = css`
  height: 40%;
  width: 0;
  margin-right: 15%;
  filter: drop-shadow(0 0 1px black);
  & img {
    filter: none;
  }
`

export default ScorePart