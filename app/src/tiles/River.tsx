/** @jsxImportSource @emotion/react */
import {css, Theme, useTheme} from '@emotion/react'
import {getForestView, isLegalTilePosition} from '@gamepark/grandbois/ForestView'
import GameView from '@gamepark/grandbois/GameView'
import PlacedTile, {isPlacedTile} from '@gamepark/grandbois/material/PlacedTile'
import {tiles} from '@gamepark/grandbois/material/Tiles'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import MoveType from '@gamepark/grandbois/moves/MoveType'
import {useDisplayState, usePlay, usePlayerId} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import equal from 'fast-deep-equal'
import {FC, MouseEvent, useEffect, useState} from 'react'
import {useDrop, XYCoord} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import PlaceForestTile from '../../../rules/src/moves/PlaceForestTile'
import DraggedTile, {draggedTile} from '../drag-objects/DraggedTile'
import Images from '../material/Images'
import {LightTheme} from '../Theme'
import Button from '../util/Button'
import {
  cardHeight, cardStyle, placedCardX, placedCardY, riverAreaHeight, riverAreaLeft, riverAreaTop, riverAreaWidth, riverLeft, riverTop, topMargin
} from '../util/Styles'
import {convertIntoPercent, initialForestPosition} from './Forest'
import RotatedTile from './RotatedTile'
import TileCard from './TileCard'

type Props = {
  game: GameView
}

const River: FC<Props> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const playerId = usePlayerId<TowerColor>()
  const play = usePlay<PlaceForestTile>()
  const [playingTile, setPlayingTile] = useState<PlacedTile>()
  const [riverTiles, setRiverTiles] = useState<(RotatedTile|null)[]>([])
  useEffect(() => {
    if (playingTile && !game.river.some(tile => tile === playingTile.tile))
      setPlayingTile(undefined)
  }, [game, playingTile])
  const rotate = (event: MouseEvent<HTMLDivElement>, tile: number) => {
    event.stopPropagation()
    if (playingTile && playingTile.tile === tile) {
       setPlayingTile({...playingTile, rotation: (playingTile.rotation + 1) % 4})
    }
    setRiverTiles(riverTiles.map(riverTile => riverTile?.tile === tile?{...riverTile, rotation:(riverTile.rotation + 1) % 4}:riverTile ))
  }
  useEffect(() => {
    if(!equal(game.river, riverTiles.map(riverTile => riverTile?.tile || null )))
      setRiverTiles(game.river.map(tile => tile ? riverTiles.find(rotatedTile => rotatedTile?.tile === tile) || {tile, rotation: 0} : null))
  }, [game, riverTiles])
  const [forestCenter] = useDisplayState<XYCoord>(initialForestPosition)
  const deltaPercent = convertIntoPercent(forestCenter)
  const isLegalTile = playingTile && isLegalTilePosition(getForestView(game), playingTile)
  const [, ref] = useDrop({
    accept: 'Tile',
    canDrop: (item: DraggedTile) => isPlacedTile(item),
    drop: () => undefined
  })
  return <>
    {
      riverTiles.map((rotatedTile, index) => {
          if (!rotatedTile) return null
          const item = playingTile && playingTile.tile === rotatedTile.tile ? {type: draggedTile, ...playingTile} : {type: draggedTile, ...rotatedTile}
          return <Draggable key={rotatedTile.tile} item={item}
                            drop={setPlayingTile}
                            disabled={game.activePlayer !== playerId}
                            animation={{properties: ['transform', 'left', 'top'], seconds: 0.2}}
                            css={[cardStyle,
                              playingTile && playingTile.tile === rotatedTile.tile ? playingTileStyle(isLegalTile!,playingTile.x, deltaPercent.x, playingTile.y, deltaPercent.y, theme) : riverTileStyle(index,theme)
                            ]}>
            <TileCard tile={tiles[rotatedTile.tile]} css={rotatedStyle(rotatedTile.rotation)}
                      onClick={event => rotate(event, rotatedTile.tile)}/>
          </Draggable>
        }
      )
    }
    {
      playingTile && isLegalTile
      && <Button css={validStyle} onClick={() => play({type: MoveType.PlaceForestTile, placedTile: playingTile})}>{t('Validate')}</Button>
    }
    <div ref={ref} css={riverAreaStyle} />
  </>
}

const riverAreaStyle = css`
  z-index:1;
  position:absolute;
  left: ${riverAreaLeft}%;
  top:${riverAreaTop}%;
  width:${riverAreaWidth}%;
  height:${riverAreaHeight}%;
  background-image: url(${Images.woodTexture});
  background-position: center center;
  background-repeat: repeat;
  background-size: cover;
  border-radius: 1em;
  border: solid 0.1em saddlebrown;
  box-shadow: 0 0 1em #000;
`

const validStyle = css`
  position:absolute;
  bottom: 37%;
  right: 2%;
  font-size:4em;
  z-index:2;
`

const playingTileStyle = (highlight: boolean, x: number, deltaX: number, y: number, deltaY: number, theme: Theme) => css`
  left: ${placedCardX(x, deltaX)}%;
  top: ${placedCardY(y, deltaY)}%;
  z-index: 2;
  ${rotationArrowStyle(theme)}
  ${borderStyle(highlight)}
`

const riverTileStyle = (index: number, theme: Theme) => css`
  top: ${riverCardY(index)}%;
  left: ${riverLeft}%;
  z-index: 2;
  &:hover{
    ${rotationArrowStyle(theme)}
  }
`

const rotatedStyle = (rotation: number) => css`
  transform: rotate(${90 * rotation}deg);
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2em solid greenyellow;
  box-shadow: 0.2em 0.2em 1em greenyellow;
` : css`
  border: 0.2em solid darkred;
  box-shadow: 0.2em 0.2em 1em darkred;
`

const rotationArrowStyle = (theme: Theme) => css`
  &:before {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    left:85%;
    top:20%;
    background-image: url(${theme.color === LightTheme ? Images.rotate : Images.rotateDark});
    background-size: contain;
    background-repeat: no-repeat;
    transform: rotate(-60deg);
  }
`

export const riverCardY = (index: number) => riverTop + (cardHeight + topMargin) * index

export const riverTileTop = (game: GameView, tile: number) => riverCardY(game.river.indexOf(tile))

export default River