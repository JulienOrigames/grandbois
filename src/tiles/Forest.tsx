import {css} from '@emotion/core'
import React, {FunctionComponent, useContext, useEffect, useReducer, useRef, useState} from 'react'
import {
  forestCardStyle, forestCardX, forestCardY, forestHeight, forestLeft, forestTop, forestWidth, riverLeft, screenRatio, spaceHeight, spaceWidth
} from '../util/Styles'
import TileCard from './TileCard'
import GameView from '../types/GameView'
import {tiles} from './Tiles'
import {DndContext, DropTargetMonitor, useDrag, useDrop, XYCoord} from 'react-dnd'
import DraggedTile from '../drag-objects/DraggedTile'
import {riverTileTop} from './River'
import {getForestView, isAvailablePosition} from '../Rules'
import {forestArea} from '../drag-objects/ForestArea'
import {getEmptyImage} from 'react-dnd-html5-backend'
import {DragDropManager} from 'dnd-core/lib/interfaces'
import {useDisplayState} from '@gamepark/workshop'

type Props = {
  game: GameView
}

const Forest: FunctionComponent<Props> = ({game}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, dropRef] = useDrop({
    accept: 'Tile',
    canDrop: (item: DraggedTile, monitor: DropTargetMonitor) => {
      //console.log(forestCenter)
      const overPosition = getForestPosition(game, item, monitor,forestCenter)
      if (!overPosition) return false
      //console.log(overPosition.x+'/'+overPosition.y)
      return isAvailablePosition(getForestView(game.forest), overPosition.x, overPosition.y)
    },
    drop: (item: DraggedTile, monitor) => {
      const overPosition = getForestPosition(game, item, monitor,forestCenter)
      return {
        tile: item.tile,
        x: overPosition!.x,
        y: overPosition!.y,
        rotation: item.rotation??0
      }
    }
  })
  const [{dragging}, dragRef, preview] = useDrag({
      item: {type: forestArea},
      collect: monitor => ({
        dragging: monitor.isDragging()
      })
    }
  )
  useEffect(() => {
    preview(getEmptyImage())
  }, [preview])
  const dragOffsetDiff = useDragOffsetDiff(dragging)

  const [forestCenter, setForestCenter] = useDisplayState<XYCoord>(initialForestPosition)
  useEffect(() => {
      // console.log(forestCenter)
      // console.log(dragging)
      // console.log(dragOffsetDiff)
    if (!dragging && dragOffsetDiff && (dragOffsetDiff.x || dragOffsetDiff.y))
      setForestCenter({
          x: forestCenter.x + dragOffsetDiff.x,
          y: forestCenter.y + dragOffsetDiff.y
        }
      )
  }, [dragOffsetDiff, dragging, forestCenter,setForestCenter])
  dragRef(dropRef(ref))
  return <div css={style} ref={ref}>
    <div css={forestStyle(forestCenter.x + (dragOffsetDiff?.x ?? 0), forestCenter.y + (dragOffsetDiff?.y ?? 0))}>
      {
        game.forest.map((placedTile) =>
          <TileCard key={placedTile.tile}
                    tile={tiles[placedTile.tile]}
                    css={[forestCardStyle, css`
                         left: ${forestCardX(placedTile.x)}%;
                         top: ${forestCardY(placedTile.y)}%;
                         transform: rotate(${90 * placedTile.rotation}deg);
       `]}
          />)
      }
    </div>
  </div>
}

export const initialForestPosition = {x: 0, y: 0}

const style = css`
  position: absolute;
  top: ${forestTop}%;
  left: ${forestLeft}%;
  width: ${forestWidth}%;
  height: ${forestHeight}%;
  //overflow:hidden;
`
const forestStyle = (deltaX: number, deltaY: number) => css`
  transform:translate(${deltaX}px,${deltaY}px);
  width:100%;
  height:100%;
  // background:rgba(0,0,0,0.1);
`

function getForestPosition(game: GameView, item: DraggedTile, monitor: DropTargetMonitor, forestCenter:XYCoord) {

  const position = monitor.getDifferenceFromInitialOffset()
  if (!position) return
  const percent = convertIntoPercent(position)
  const deltaForest = convertIntoPercent(forestCenter)
  let overPosition: XYCoord
  if (item.rotation !== undefined) {
    // drop tile from the forest
    overPosition = getInsideForestCoordinates(game, item, percent)
  } else
    // drop tile from the river
    overPosition = getForestCoordinates(game, item.tile, percent, deltaForest)

  return overPosition
}

export const convertIntoPercent = (coordinates: XYCoord) => ({
  x: window.innerWidth / window.innerHeight > screenRatio ? coordinates.x * 100 / (window.innerHeight * screenRatio) : coordinates.x * 100 / window.innerWidth,
  y: window.innerWidth / window.innerHeight > screenRatio ? coordinates.y * 100 / window.innerHeight : coordinates.y * 100 / (window.innerWidth / screenRatio)
})

const getForestCoordinates = (game: GameView, tile: number, coordinates: XYCoord,delta:XYCoord) => ({
  x: Math.round((coordinates.x - delta.x + riverLeft - forestLeft - (forestWidth / 2) + spaceWidth) / spaceWidth),
  y: Math.round((coordinates.y - delta.y + riverTileTop(game, tile) - forestTop - (forestHeight / 2) + spaceHeight) / spaceHeight)
})

const getInsideForestCoordinates = (game: GameView, playingTile: DraggedTile, coordinates: XYCoord) => ({
  x: Math.round(playingTile.x! + (coordinates.x / spaceWidth)),
  y: Math.round(playingTile.y! + (coordinates.y / spaceHeight))
})

// function fromPXToSpace (coordinates: XYCoord) {
//   const percent = convertIntoPercent(coordinates)
//   return {
//     x: Math.round(percent.x / spaceWidth),
//     y: Math.round(percent.y / spaceHeight)
//   }
// }

const useDragOffsetDiff = (enabled: Boolean, fps = 60) => {
  const {dragDropManager} = useContext(DndContext)
  const monitor = (dragDropManager as DragDropManager).getMonitor()
  const [dragOffsetDiff, setDragOffsetDiff] = useState(monitor.getDifferenceFromInitialOffset())
  const offsetChangeListener = () => setDragOffsetDiff(monitor.getDifferenceFromInitialOffset())
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const cleanup = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setDragOffsetDiff({x: 0, y: 0})
    }
  }
  useEffect(() => {
    if (enabled) {
      setIntervalId(setInterval(() => {
        offsetChangeListener()
      }, 1000 / fps))
    } else {
      cleanup()
    }
    return cleanup
  }, [enabled])
  return dragOffsetDiff
}

export default Forest