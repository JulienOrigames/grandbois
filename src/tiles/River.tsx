import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {cardHeight, cardStyle, riverTop, topMargin} from '../util/Styles'
import TileCard from './TileCard'
import {tiles} from './Tiles'
import GameView from '../types/GameView'
import {Draggable} from '@interlude-games/workshop'
import {draggedTile} from '../drag-objects/DraggedTile'

const River: FunctionComponent<{ game: GameView }> = ({game}) => {
  return <>
    {game.river.map((tile, index) =>
      <Draggable item={{type:draggedTile,tile}}
                 css={[cardStyle, css`
                        position: absolute;
                        top: ${riverCardY(index)}%;
                        left: 0.3%;
      `                ]}>
        <TileCard key={tile} tile={tiles[tile]} />
      </Draggable>
      )}
  </>
}

export const riverCardY = (index: number) => riverTop + ( cardHeight + topMargin ) * index

export default River