import {css} from '@emotion/core'
import React, {forwardRef} from 'react'
import Tile from '@gamepark/grandbois/material/Tile'
import Images from '../material/Images'
import {
  Tile1, Tile2, Tile3, Tile4, Tile5, Tile6, Tile7, Tile8, Tile9, Tile10,
  Tile11, Tile12, Tile13, Tile14, Tile15, Tile16, Tile17, Tile18, Tile19, Tile20,
  Tile21, Tile22, Tile23, Tile24, Tile25, Tile26, Tile27, Tile28, Tile29, Tile30,
  Tile31, Tile32, Tile33, Tile34, Tile35, Tile36, TileStart
} from '@gamepark/grandbois/material/Tiles'


type Props = { tile?: Tile } & React.HTMLAttributes<HTMLDivElement>

const TileCard = forwardRef<HTMLDivElement, Props>(({tile, ...props}, ref) => {
  return (
    <div ref={ref} {...props} css={[style, !tile && hidden]}>
      <div css={[frontFace, getBackgroundImage(tile)]}>
      </div>
    </div>
  )
})

const style = css`
  height: 100%;
  width: 100%;
  border-radius: 6%;
  box-shadow: 0 0 3px black;
  transform-style: preserve-3d;
  transform: translateZ(0);
  -webkit-font-smoothing: subpixel-antialiased;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6%;
    background-image: url(${Images.tileBack});
    background-size: cover;
    transform: rotateY(180deg);
    backface-visibility: hidden;
  }
`

const hidden = css`
    transform: rotateY(180deg);
`

const frontFace = css`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-size: cover;
  border-radius: 6%;
`

const getBackgroundImage = (tile?: Tile) => css`
  background-image: url(${tile ? images.get(tile) : Images.tileBack});
`

const images = new Map<Tile, any>()

images.set(TileStart, Images.tileStart)
images.set(Tile1, Images.tile1)
images.set(Tile2, Images.tile2)
images.set(Tile3, Images.tile3)
images.set(Tile4, Images.tile4)
images.set(Tile5, Images.tile5)
images.set(Tile6, Images.tile6)
images.set(Tile7, Images.tile7)
images.set(Tile8, Images.tile8)
images.set(Tile9, Images.tile9)
images.set(Tile10, Images.tile10)
images.set(Tile11, Images.tile11)
images.set(Tile12, Images.tile12)
images.set(Tile13, Images.tile13)
images.set(Tile14, Images.tile14)
images.set(Tile15, Images.tile15)
images.set(Tile16, Images.tile16)
images.set(Tile17, Images.tile17)
images.set(Tile18, Images.tile18)
images.set(Tile19, Images.tile19)
images.set(Tile20, Images.tile20)
images.set(Tile21, Images.tile21)
images.set(Tile22, Images.tile22)
images.set(Tile23, Images.tile23)
images.set(Tile24, Images.tile24)
images.set(Tile25, Images.tile25)
images.set(Tile26, Images.tile26)
images.set(Tile27, Images.tile27)
images.set(Tile28, Images.tile28)
images.set(Tile29, Images.tile29)
images.set(Tile30, Images.tile30)
images.set(Tile31, Images.tile31)
images.set(Tile32, Images.tile32)
images.set(Tile33, Images.tile33)
images.set(Tile34, Images.tile34)
images.set(Tile35, Images.tile35)
images.set(Tile36, Images.tile36)

export default TileCard