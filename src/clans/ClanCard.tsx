import {css} from '@emotion/core'
import React, {forwardRef, useState} from 'react'
import Images from '../material/Images'
import Clan from './Clan'


type Props = { clan?: Clan, showScore:boolean } & React.HTMLAttributes<HTMLDivElement>

const ClanCard = forwardRef<HTMLDivElement, Props>(({clan, showScore,...props}, ref) => {
  const [showClanCard, setShowClanCard] = useState(showScore)
  return (
    <div ref={ref} {...props} css={[style(clan),showClanCard && flipStyle ]}
         onMouseDown={() => setShowClanCard(true)} onMouseUp={() => !showScore && setShowClanCard(false)}>
    </div>
  )
})

const style = (clan?: Clan) => css`
  border-radius: 6%;
  box-shadow: 0 0 5px black;
  transform-style: preserve-3d;
  &:before, &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-size: cover;
    border-radius: 6%;
  }
  &:before {
    background-image: url(${Images.cardClanBack});
  }
  &:after {
    background-image: url(${clan ? images.get(clan) : Images.cardClanBack});
    transform: rotateY(180deg);
  }
`

const flipStyle = css`
  transform: rotateY(180deg);
`

const images = new Map<Clan, any>()

images.set(Clan.Toad, Images.cardToads)
images.set(Clan.Rabbit, Images.cardRabbits)
images.set(Clan.Fox, Images.cardFoxes)
images.set(Clan.Raccoon, Images.cardRaccoons)
images.set(Clan.Lizard, Images.cardLizards)

export default ClanCard