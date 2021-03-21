/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameState from '@gamepark/grandbois/GameState'
import GameView from '@gamepark/grandbois/GameView'
import Player from '@gamepark/grandbois/Player'
import PlayerView from '@gamepark/grandbois/PlayerView'
import {FC, HTMLAttributes} from 'react'
import VictoryPointsMultiplier from './VictoryPointsMultiplier'

type Props = {
  game: GameState|GameView
  player: Player | PlayerView
  item: number
  multiplier:number
  score:number
} & HTMLAttributes<HTMLDivElement>

const ScorePart: FC<Props> = ({game, player, item,multiplier,score}) => {
  const clans = (player as Player).clans
  const twoPlayersGame = game.players.length === 2
  return (
    <div css={style(twoPlayersGame)}>
      <div css={scoreStyle}>{score}</div>
      <VictoryPointsMultiplier css={multiplierStyle(twoPlayersGame)} item={item} clans={clans} tower={player.tower} multiplier={multiplier} />
    </div>
  )
}

const style = (twoPlayersGame:boolean) => css`
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
    top: ${twoPlayersGame?10:30}%;
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

const multiplierStyle = (twoPlayersGame:boolean) => css`
  height: ${twoPlayersGame?25:40}%;
  width: 0;
  margin-right: 15%;
`

export default ScorePart