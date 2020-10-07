import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {
  centerLeft, centerTop, forestCardHeight, forestCardWidth, forestHeight, forestLeft, forestTop, forestWidth, halfForestCardHeight, halfForestCardWidth
} from '../util/Styles'
import TileCard from './TileCard'
import GameView from '../types/GameView'
import {tiles, TileStart} from './Tiles'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import DraggedTile from '../drag-objects/DraggedTile'

const Forest: FunctionComponent<{ game: GameView }> = ({game}) => {
  const canDrop = (item: DraggedTile, monitor: DropTargetMonitor ) => {
    // const destination = getTileDestination(item.tile, monitor.getDifferenceFromInitialOffset())
    return true // TODO : remove illegal drops (only forest or void)
  }
  const [, ref] = useDrop({
    accept: 'Tile',
    canDrop,
    // drop // gérer setState
  })
  return <div ref={ref} css={style}>
    <TileCard key={0}
                tile={TileStart}
                css={[forestCardStyle, css`
                      top: ${centerTop}%;
                      left: ${centerLeft}%;
    `                ]}
    />
    {
      game.forest.map((placedTile, index) =>
         <TileCard key={placedTile.tile}
                   tile={tiles[placedTile.tile]}
                   css={[forestCardStyle, css`
                       left: ${forestCardX(placedTile.x)}%;
                       top: ${forestCardY(placedTile.y)}%;
                       transform: rotate(${90*placedTile.rotate}deg);
     `                ]}
         />)
    }
  </div>
}

const style = css`
  position: absolute;
  top: ${forestTop}%;
  left: ${forestLeft}%;
  width: ${forestWidth}%;
  height: ${forestHeight}%;
`

const forestCardStyle = css`
  position: absolute;
  width: ${forestCardWidth}%;
  height: ${forestCardHeight}%;
`

export const forestCardX = (x: number) => centerLeft + ( halfForestCardWidth * x )
export const forestCardY = (y: number) => centerTop + ( halfForestCardHeight * y )

export default Forest