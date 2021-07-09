/** @jsxImportSource @emotion/react */
import {css, keyframes, Theme, useTheme} from '@emotion/react'
import {getForestView, isLegalTilePosition} from '@gamepark/grandbois/ForestView'
import GameView from '@gamepark/grandbois/GameView'
import PlacedTile, {getPlacedTileSpaceXY, isPlacedTile} from '@gamepark/grandbois/material/PlacedTile'
import {tiles} from '@gamepark/grandbois/material/Tiles'
import TowerColor from '@gamepark/grandbois/material/TowerColor'
import MoveType from '@gamepark/grandbois/moves/MoveType'
import {usePlay, usePlayerId} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import equal from 'fast-deep-equal'
import {FC, MouseEvent, useEffect, useState} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DraggedTile, {draggedTile} from '../drag-objects/DraggedTile'
import Images from '../material/Images'
import Button from '../util/Button'
import {
  cardHeight,
  cardStyle, placedCardX, placedCardY, riverAreaHeight, riverAreaLeft, riverAreaTop, riverAreaWidth, riverLeft, riverTop, spaceHeight, spaceWidth, topMargin
} from '../util/Styles'
import {convertIntoPercent, initialForestPosition} from './Forest'
import RotatedTile from './RotatedTile'
import TileCard from './TileCard'
import {activePlayerCouldPlaceTower} from '@gamepark/grandbois/Grandbois'
import PlaceForestTile from '@gamepark/grandbois/moves/PlaceForestTile'
import PlaceTower from '@gamepark/grandbois/moves/PlaceTower'
import {Clearing} from '@gamepark/grandbois/material/Tile'
import {towerImage} from '../clans/TowerInfo'
import ChangeActivePlayer from '@gamepark/grandbois/moves/ChangeActivePlayer'

type Props = {
  game: GameView
}

const River: FC<Props> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  const playerId = usePlayerId<TowerColor>()
  const play = usePlay<PlaceForestTile | PlaceTower | ChangeActivePlayer>()
  const [playingTile, setPlayingTile] = useState<PlacedTile>()
  const [showTowerPosition, setShowTowerPosition] = useState<boolean>(false)
  useEffect(() => {
    if (!playingTile) setShowTowerPosition(false)
  }, [playingTile])
  const [riverTiles, setRiverTiles] = useState<(RotatedTile | null)[]>([])
  useEffect(() => {
    if (playingTile && !game.river.some(tile => tile === playingTile.tile))
      setPlayingTile(undefined)
  }, [game, playingTile])
  const rotate = (event: MouseEvent<HTMLDivElement>, tile: number) => {
    event.stopPropagation()
    if (playingTile && playingTile.tile === tile) {
      setPlayingTile({...playingTile, rotation: (playingTile.rotation + 1) % 4})
    }
    setRiverTiles(riverTiles.map(riverTile => riverTile?.tile === tile ? {...riverTile, rotation: (riverTile.rotation + 1) % 4} : riverTile))
  }
  useEffect(() => {
    if (!equal(game.river, riverTiles.map(riverTile => riverTile?.tile || null)))
      setRiverTiles(game.river.map(tile => tile ? riverTiles.find(rotatedTile => rotatedTile?.tile === tile) || {tile, rotation: 0} : null))
  }, [game, riverTiles])
  const forestCenter = game.forestCenter ?? initialForestPosition
  const deltaPercent = convertIntoPercent(forestCenter)
  const isLegalTile = playingTile && isLegalTilePosition(getForestView(game), playingTile)
  const towerPotentialPosition = (playerId && playerId === game.activePlayer && playingTile && isLegalTile && showTowerPosition) ? getTowerPotentialPosition(playingTile) : null
  const [, ref] = useDrop({
    accept: 'Tile',
    canDrop: (item: DraggedTile) => isPlacedTile(item),
    drop: () => undefined
  })
  const placeTileAndTower = (playingTile: PlacedTile) => {
    play({type: MoveType.PlaceForestTile, placedTile: playingTile})
    play({type: MoveType.PlaceTower})
  }
  const placeTileAndEndTurn = (playingTile: PlacedTile) => {
    play({type: MoveType.PlaceForestTile, placedTile: playingTile})
    play({type: MoveType.ChangeActivePlayer})
  }
  const placeTile = (playingTile: PlacedTile) => {
    play({type: MoveType.PlaceForestTile, placedTile: playingTile})
  }
  return <>
    {
      riverTiles.map((rotatedTile, index) => {
          if (!rotatedTile) return null
          const item = playingTile && playingTile.tile === rotatedTile.tile ? playingTile : rotatedTile
          return <Draggable key={rotatedTile.tile} type={draggedTile} item={item}
                            drop={setPlayingTile}
                            canDrag={game.activePlayer === playerId}
                            animation={{properties: ['transform', 'left', 'top'], seconds: 0.2}}
                            css={[cardStyle,
                              playingTile && playingTile.tile === rotatedTile.tile ? playingTileStyle(isLegalTile!, playingTile.x, deltaPercent.x, playingTile.y, deltaPercent.y, theme) : riverTileStyle(index, theme)
                            ]}>
            <TileCard tile={tiles[rotatedTile.tile]} css={rotatedStyle(rotatedTile.rotation)}
                      onClick={event => rotate(event, rotatedTile.tile)}/>
          </Draggable>
        }
      )
    }
    {
      playerId && playerId === game.activePlayer && playingTile && isLegalTile
      &&
      <div css={towerChoiceStyle}>

        {
          activePlayerCouldPlaceTower(game, playingTile)
            ?
            <>
              <p css={questionStyle} >{t('Would you like to place your Watchtower here?')}</p>
              <Button css={validateStyle} onClick={() => placeTileAndTower(playingTile)}
                      onMouseEnter={() => setShowTowerPosition(true)}
                      onMouseLeave={() => setShowTowerPosition(false)}>
                {t('Place my Watchtower and end my turn')}
              </Button>
              <br/>
              <Button css={validateStyle} onClick={() => placeTileAndEndTurn(playingTile)}>{t('Just validate the tile and end my turn')}</Button>
            </>
            :
            <>
            <p>{t('Would you like to place your tile here?')}</p>
            <Button css={validateStyle} onClick={() => placeTile(playingTile)}>{t('Yes, end my turn')}</Button>
            </>
        }
      </div>
    }
    {
      showTowerPosition && towerPotentialPosition !== null
      &&
      <div css={towerStyle(playerId!, towerPotentialPosition.x, deltaPercent.x, towerPotentialPosition.y, deltaPercent.y)}/>
    }

    <div ref={ref} css={riverAreaStyle}/>
  </>
}

const riverAreaStyle = css`
  z-index: 1;
  position: absolute;
  left: ${riverAreaLeft}%;
  top: ${riverAreaTop}%;
  width: ${riverAreaWidth}%;
  height: ${riverAreaHeight}%;
  background-image: url(${Images.woodTexture});
  background-position: center center;
  background-repeat: repeat;
  background-size: cover;
  border-radius: 1em;
  border: solid 0.1em saddlebrown;
  box-shadow: 0 0 1em #000;
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

  &:hover {
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
    left: 85%;
    top: 20%;
    background-image: url(${theme.light ? Images.rotate : Images.rotateDark});
    background-size: contain;
    background-repeat: no-repeat;
    transform: rotate(-60deg);
  }
`

const towerChoiceStyle = css`
  position: absolute;
  right: 22%;
  bottom: 1%;
  width: 20%;
  font-size: 2.5em;
  padding: 0.5em;
  z-index: 5;
  background-image: url(${Images.woodTexture});
  background-position: center center;
  background-repeat: repeat;
  background-size: cover;
  border-radius: 0.5em;
  border: solid 0.1em #8b4513;
  box-shadow: 0 0 1em #000;
  text-align: center;
  color: #fff381;
`

const towerStyle = (tower: TowerColor, x: number, deltaX: number, y: number, deltaY: number) => css`
  position: absolute;
  left: ${placedCardX(x, deltaX) - 1}%;
  top: ${placedCardY(y, deltaY) - 4}%;
  width: ${spaceWidth + 2}%;
  height: ${spaceHeight + 4}%;
  z-index: 3;
  background-image: url(${towerImage[tower]});
  filter: drop-shadow(0.1em 0.1em 0.4em white);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  animation: ${pulse} 0.5s linear alternate infinite;
`
const pulse = keyframes`
  to {
    transform: translate(0%, -10%) scale(1.2);
  }
`

function getTowerPotentialPosition(playingTile: PlacedTile | undefined) {
  if (playingTile !== undefined) {
    const clearingIndex = tiles[playingTile.tile].findIndex(space => space === Clearing)
    return getPlacedTileSpaceXY(playingTile, clearingIndex)
  } else
    return null
}

const questionStyle = css`
  margin : 0 0 10px 0;
`
const validateStyle = css`
  font-size : 90%;
  margin : 0 0 10px 0;
`

export const riverCardY = (index: number) => riverTop + (cardHeight + topMargin) * index

export const riverTileTop = (game: GameView, tile: number) => riverCardY(game.river.indexOf(tile))

export default River