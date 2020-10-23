import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {
  forestCardStyle, forestCardX, forestCardY, forestHeight, forestLeft, forestTop, forestWidth, riverLeft, screenRatio, spaceHeight, spaceWidth
} from '../util/Styles'
import TileCard from './TileCard'
import GameView from '../types/GameView'
import {tiles} from './Tiles'
import {DropTargetMonitor, useDrop, XYCoord} from 'react-dnd'
import DraggedTile from '../drag-objects/DraggedTile'
import PlacedTile from './PlacedTile'
import {riverTileTop} from './River'
import {getForestView, isAvailablePosition} from '../Rules'

type Props = {
  game: GameView
  playingTile?: PlacedTile
  setPlayingTile: (playingTile:PlacedTile) => void
}

const Forest: FunctionComponent<Props> = ({game, playingTile, setPlayingTile}) => {
  const [, ref] = useDrop({
    accept: 'Tile',
    canDrop:(item: DraggedTile, monitor: DropTargetMonitor ) => {
      const overPosition = getForestPosition(game,item,monitor,playingTile);
      if(!overPosition) return false
      // console.log(overPosition.x+'/'+overPosition.y)
      return isAvailablePosition(getForestView(game.forest),overPosition.x,overPosition.y)
    },
    drop: (item: DraggedTile,monitor) => {
      const overPosition = getForestPosition(game,item,monitor,playingTile);
      return { tile : item.tile,
        x : overPosition!.x,
        y : overPosition!.y,
        rotation : playingTile?playingTile.rotation:0
      }
    }
  })
  return <div ref={ref} css={style}>
    {
      game.forest.map((placedTile) =>
         <TileCard key={placedTile.tile}
                   tile={tiles[placedTile.tile]}
                   css={[forestCardStyle, css`
                       left: ${forestCardX(placedTile.x)}%;
                       top: ${forestCardY(placedTile.y)}%;
                       transform: rotate(${90*placedTile.rotation}deg);
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

function getForestPosition(game:GameView, item: DraggedTile, monitor: DropTargetMonitor, playingTile?: PlacedTile){

  const position = monitor.getDifferenceFromInitialOffset();
  if (!position) return
  const percent = convertIntoPercent(position)
  let overPosition: XYCoord = {x: 0, y: 0}
  if (playingTile && item.tile === playingTile.tile) {
    // drop tile from the forest
    overPosition = getInsideForestCoordinates(game, playingTile, percent)
  } else
    // drop tile from the river
    overPosition = getForestCoordinates(game, item.tile, percent)

  return overPosition
}

const convertIntoPercent = (coordinates: XYCoord) => ({
  x: window.innerWidth / window.innerHeight > screenRatio ? coordinates.x * 100 / (window.innerHeight * screenRatio) : coordinates.x * 100 / window.innerWidth,
  y: window.innerWidth / window.innerHeight > screenRatio ? coordinates.y * 100 / window.innerHeight : coordinates.y * 100 / (window.innerWidth / screenRatio)
})

const getForestCoordinates = (game:GameView, tile:number, coordinates: XYCoord) => ({
  x: Math.round(( coordinates.x + riverLeft - forestLeft - (forestWidth/2) + spaceWidth ) / spaceWidth),
  y: Math.round(( coordinates.y + riverTileTop(game, tile) - forestTop - (forestHeight/2) + spaceHeight ) / spaceHeight)
})

const getInsideForestCoordinates = (game:GameView, playingTile: PlacedTile, coordinates: XYCoord) => ({
  x: Math.round(playingTile.x + ( coordinates.x / spaceWidth) ),
  y: Math.round(playingTile.y + ( coordinates.y / spaceHeight) )
})

export default Forest