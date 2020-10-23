import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {cardHeight, cardStyle, placedCardX, placedCardY, riverLeft, riverTop, topMargin} from '../util/Styles'
import TileCard from './TileCard'
import {tiles} from './Tiles'
import GameView from '../types/GameView'
import {Draggable, usePlayerId} from '@gamepark/workshop'
import {draggedTile} from '../drag-objects/DraggedTile'
import PlacedTile from './PlacedTile'
import {getForestView, isLegalTilePosition} from '../Rules'
import Images from '../material/Images'
import TowerColor from '../clans/TowerColor'

type Props = {
  game: GameView
  playingTile?: PlacedTile
  setPlayingTile: (playingTile:PlacedTile) => void
}

const River: FunctionComponent<Props> = ({game, playingTile,setPlayingTile}) => {
  const playerId = usePlayerId<TowerColor>()
  return <>
    {game.river.map((tile, index) => {

        if( !tile ) return null

        return (playingTile && playingTile.tile === tile) ?
          <Draggable key={tile} item={{type: draggedTile, tile}} onDrop={setPlayingTile}
                     disabled={game.activePlayer !== playerId}
                     animation={{properties: ['transform', 'left', 'top'], seconds: 0.2}}
                     css={[cardStyle,
                            borderStyle(isLegalTilePosition(getForestView(game.forest),playingTile)),
                            css`
                            left: ${placedCardX(playingTile.x)}%;
                            top: ${placedCardY(playingTile.y)}%;
                            z-index: 1;
                          `]}>
            <TileCard tile={tiles[tile]} css={draggedTileStyle(playingTile.rotation)}
                      onClick={()=>setPlayingTile({...playingTile,rotation:(playingTile.rotation + 1)%4})}/>
          </Draggable>
          :
          <Draggable key={tile} item={{type: draggedTile, tile}} onDrop={setPlayingTile}
                     disabled={game.activePlayer !== playerId}
                     animation={{properties: ['transform', 'left', 'top'], seconds: 0.2}}
                     css={[cardStyle, css`
                                top: ${riverCardY(index)}%;
                                left: ${riverLeft}%;
              `]}>
            <TileCard tile={tiles[tile]}/>
          </Draggable>
      }
    )}
  </>
}

const borderStyle = (highlight: boolean) => highlight ? css`
  border: 0.2em solid greenyellow;
  box-shadow: 0.2em 0.2em 1em greenyellow;
` : css`
  border: 0.2em solid darkred;
  box-shadow: 0.2em 0.2em 1em darkred;
`

const draggedTileStyle = (rotation: number) => css`
  transform: rotate(${90 * rotation}deg);
  &:before {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    left:85%;
    top:20%;
    background-image: url(${Images.rotate});
    background-size: contain;
    background-repeat: no-repeat;
    transform: rotate(-60deg);
  }
`

export const riverCardY = (index: number) => riverTop + ( cardHeight + topMargin ) * index

export const riverTileTop = (game: GameView, tile: number) => riverCardY(game.river.indexOf(tile))

export default River