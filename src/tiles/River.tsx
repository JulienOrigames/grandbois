import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {cardHeight, cardStyle, placedCardX, placedCardY, riverLeft, riverTop, topMargin} from '../util/Styles'
import TileCard from './TileCard'
import {tiles} from './Tiles'
import GameView from '../types/GameView'
import {Draggable} from '@interlude-games/workshop'
import {draggedTile} from '../drag-objects/DraggedTile'
import PlacedTile from './PlacedTile'

type Props = {
  game: GameView
  playingTile?: PlacedTile
}

const River: FunctionComponent<Props> = ({game, playingTile}) => {
  return <>
    {game.river.map((tile, index) =>

        ( playingTile && playingTile.tile === tile )?
            <Draggable item={{type: draggedTile, tile}}
                       css={[cardStyle, css`
                            left: ${placedCardX(playingTile.x)}%;
                            top: ${placedCardY(playingTile.y)}%;
                            z-index: 1;
                `]}>
              <TileCard key={tile} tile={tiles[tile]} css={css`transform: rotate(${90 * playingTile.rotate}deg);`}/>
            </Draggable>
          :
            <Draggable item={{type: draggedTile, tile}}
                       css={[cardStyle, css`
                                top: ${riverCardY(index)}%;
                                left: ${riverLeft}%;
              `]}>
            <TileCard key={tile} tile={tiles[tile]}/>
            </Draggable>
      )}
  </>
}

export const riverCardY = (index: number) => riverTop + ( cardHeight + topMargin ) * index

export const riverTileTop = (game: GameView, tile: number) => riverCardY(game.river.indexOf(tile))

export default River