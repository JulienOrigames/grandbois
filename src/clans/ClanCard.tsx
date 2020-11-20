import {css} from '@emotion/core'
import React, {forwardRef, useState} from 'react'
import Images from '../material/Images'
import Clan from './Clan'
import {useTranslation} from 'react-i18next'

type Props = { clan?: Clan, showScore:boolean } & React.HTMLAttributes<HTMLDivElement>

const ClanCard = forwardRef<HTMLDivElement, Props>(({clan, showScore,...props}, ref) => {
  const {t} = useTranslation()
  const [showClanCard, setShowClanCard] = useState(showScore)
  return (
    <div ref={ref} {...props} >
    <h3 css={headerStyle} >{t('Tuile de Clan secret')}</h3>
    <div css={[style(clan),showClanCard && flipStyle ]}
         onMouseDown={() => setShowClanCard(true)} onMouseUp={() => !showScore && setShowClanCard(false)}
         onTouchStart={() => setShowClanCard(true)} onTouchEnd={() => !showScore && setShowClanCard(false)}
    />
    </div>
  )
})

const style = (clan?: Clan) => css`
  position:relative;
  border-radius: 6%;
  box-shadow: 0 0 5px black;
  transform-style: preserve-3d;
  cursor:pointer;
  width:100%;
  height:100%;
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

const headerStyle = css`
  position: relative;
  z-index:3;
  font-weight: bold;
  color: #fff381;
  text-shadow: 0 0 0.1em black;
  font-size: 1.5em;
  margin-top:-10%;
  margin-bottom: 5%;
`

const images = new Map<Clan, any>()

images.set(Clan.Toad, Images.cardToads)
images.set(Clan.Rabbit, Images.cardRabbits)
images.set(Clan.Fox, Images.cardFoxes)
images.set(Clan.Raccoon, Images.cardRaccoons)
images.set(Clan.Lizard, Images.cardLizards)

export default ClanCard