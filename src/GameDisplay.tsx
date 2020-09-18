import {Letterbox} from '@interlude-games/workshop'
import React, {FunctionComponent} from 'react'
import GameView from './types/GameView'
import {fadeIn} from './util/Styles'
import {css} from '@emotion/core'
import DrawPile from './tiles/DrawPile'

const GameDisplay: FunctionComponent<{ game: GameView }> = ({game}) => {
  return (
    <Letterbox css={letterBoxStyle}>
      <DrawPile game={game}/>
    </Letterbox>
  )
}

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

export default GameDisplay