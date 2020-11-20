import {css} from '@emotion/core'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {
  cardHeight, cardStyle, placedCardX, placedCardY, riverAreaHeight, riverAreaLeft, riverAreaTop, riverAreaWidth, riverLeft, riverTop, topMargin
} from '../util/Styles'
import TileCard from './TileCard'
import {tiles} from './Tiles'
import GameView from '../types/GameView'
import {Draggable, useDisplayState, usePlay, usePlayerId} from '@gamepark/workshop'
import DraggedTile, {draggedTile} from '../drag-objects/DraggedTile'
import PlacedTile from './PlacedTile'
import {getForestView, isLegalTilePosition} from '../Rules'
import Images from '../material/Images'
import TowerColor from '../clans/TowerColor'
import Button from '../util/Button'
import PlaceForestTile, {placeForestTile} from '../moves/PlaceForestTile'
import {useTranslation} from 'react-i18next'
import {useDrop, XYCoord} from 'react-dnd'
import {convertIntoPercent, initialForestPosition} from './Forest'
import {useTheme} from 'emotion-theming'
import Theme, {LightTheme} from '../Theme'

type Props = {
  game: GameView
}

const River: FunctionComponent<Props> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const playerId = usePlayerId<TowerColor>()
  const play = usePlay<PlaceForestTile>()
  const [playingTile, setPlayingTile] = useState<PlacedTile>()
  useEffect(() => {
    if (playingTile && !game.river.some(tile => tile === playingTile.tile))
      setPlayingTile(undefined)
  }, [game, playingTile])
  const rotate = (event: React.MouseEvent<HTMLDivElement>, tile: number) => {
    event.stopPropagation()
    if (playingTile && playingTile.tile === tile) {
      setPlayingTile({...playingTile, rotation: (playingTile.rotation + 1) % 4})
    }
  }
  const [forestCenter] = useDisplayState<XYCoord>(initialForestPosition)
  const deltaPercent = convertIntoPercent(forestCenter)
  const isLegalTile = playingTile && isLegalTilePosition(getForestView(game), playingTile)
  const [, ref] = useDrop({
    accept: 'Tile',
    canDrop: (item: DraggedTile) => item.rotation !== undefined,
    drop: () => undefined
  })
  return <>
    {
      game.river.map((tile, index) => {
          if (!tile) return null
          const item = playingTile && playingTile.tile === tile ? {type: draggedTile, ...playingTile} : {type: draggedTile, tile}
          return <Draggable key={tile} item={item}
                            onDrop={setPlayingTile}
                            disabled={game.activePlayer !== playerId}
                            animation={{properties: ['transform', 'left', 'top'], seconds: 0.2}}
                            css={[cardStyle,
                              playingTile && playingTile.tile === tile && borderStyle(isLegalTile!),
                              playingTile && playingTile.tile === tile ? playingTileStyle(playingTile.x, deltaPercent.x, playingTile.y, deltaPercent.y) : riverTileStyle(index)
                            ]}>
            <TileCard tile={tiles[tile]} css={playingTile && playingTile.tile === tile && draggedTileStyle(playingTile.rotation, theme)}
                      onClick={event => rotate(event, tile)}/>
          </Draggable>
        }
      )
    }
    {
      playingTile && isLegalTile
      && <Button css={validStyle} onClick={() => play(placeForestTile(playingTile))}>{t('Valider')}</Button>
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
  bottom: 30%;
  right: 2%;
  font-size:4em;
  z-index:2;
`

const playingTileStyle = (x: number, deltaX: number, y: number, deltaY: number) => css`
  left: ${placedCardX(x, deltaX)}%;
  top: ${placedCardY(y, deltaY)}%;
  z-index: 2;
`

const riverTileStyle = (index: number) => css`
                  top: ${riverCardY(index)}%;
                  left: ${riverLeft}%;
                  z-index: 2;
`

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2em solid greenyellow;
  box-shadow: 0.2em 0.2em 1em greenyellow;
` : css`
  border: 0.2em solid darkred;
  box-shadow: 0.2em 0.2em 1em darkred;
`

const draggedTileStyle = (rotation: number, theme: Theme) => css`
  transform: rotate(${90 * rotation}deg);
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