import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {cardHeight, cardStyle, drawPileScale, headerHeight} from '../util/Styles'
import TileCard from './TileCard'
import {tiles} from './Tiles'
import GameView from '../types/GameView'

const River: FunctionComponent<{ game: GameView }> = ({game}) => {
  console.log(game.deck)
  return <>
    {game.river.map((tile, index) =>
      <TileCard key={tile}
                tile={tiles[tile]}
                css={[cardStyle, css`
                      position: absolute;
                      top: ${riverCardY(index)}%;
                      left: 10.2%;
                      transform: scale(${drawPileScale});
                      & > img {
                        box-shadow: 0 0 3px black;
                      }
    `                ]}
      />)}
  </>
}

export const riverCardY = (index: number) => headerHeight + cardHeight * drawPileScale * 1.05 * ( index + 1)

export default River