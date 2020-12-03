import {css} from '@emotion/core'
import React, {forwardRef, useState} from 'react'
import Images from '../material/Images'
import Clan from './Clan'
import {useTranslation} from 'react-i18next'
import GameView from '../types/GameView'
import {tiles} from '../tiles/Tiles'
import {isTroop, Space} from '../tiles/Tile'

type Props = { game:GameView, clan?: Clan, showScore:boolean } & React.HTMLAttributes<HTMLDivElement>

const ClanCard = forwardRef<HTMLDivElement, Props>(({game, clan, showScore,...props}, ref) => {
  const {t} = useTranslation()
  const [showClanCard, setShowClanCard] = useState(showScore)
  return (
    <div ref={ref} {...props} >
    <h3 css={[headerStyle,!showClanCard && showStyle]} >{t('Tuile de Clan secret')}</h3>
      <div css={[scaleClanStyle,showClanCard && !game.over && scaleStyle]}>
      <div css={[style(clan),(showClanCard || game.over) && flipStyle]}
         onMouseDown={() => setShowClanCard(true)} onMouseUp={() => !showScore && setShowClanCard(false)}
         onTouchStart={() => setShowClanCard(true)} onTouchEnd={() => !showScore && setShowClanCard(false)}
      />
      </div>
    { clan &&  !game.over && [1,2,3,4].map(index => <span key={index} css={[spaceCounterStyle(index),showClanCard && showStyle]} >x{getSpaceClanCount(game,index,clan)}</span> ) }
    </div>
  )
})

const scaleClanStyle = css`
  position: absolute;
  bottom:0;
  right:0;
  width:200%;
  height:200%;
  transform: scale(0.5);
  transform-origin: bottom right;
  transition: transform 0.5s ease-in-out;
`

const style = (clan?: Clan) => css`
  position:relative;
  border-radius: 6%;
  box-shadow: 0 0 5px black;
  transform-style: preserve-3d;
  cursor:pointer;
  width:100%;
  height:100%;
  transform: translateZ(0);
  will-change: transform;
  transition: transform 0.5s ease-in-out;
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

const scaleStyle = css`
  transform: scale(1);
`

const flipStyle = css`
  transform: rotateY(180deg);
`

const headerStyle = css`
  position: absolute;
  top:-13%;
  right:0;
  z-index:3;
  font-weight: bold;
  color: #fff381;
  text-shadow: 0 0 0.1em black;
  font-size: 1.5em;
  margin:0;
  opacity:0;
  transition: opacity 0.7s ease-out;
`

const spaceCounterStyle = (index:number) => css`
  position: absolute;
  z-index:6;
  font-weight: bold;
  color: #FFF;
  background: #000;
  font-size: 1.8em;
  right:0;
  top:${(index-1)*45-95}%;
  width:20%;
  height:20%;
  border-radius: 100%;
  text-align: center;
  line-height:1.6em;
  opacity:0;
  transition: opacity 0.7s ease-in;
`

const showStyle = css`
  opacity:1;
`

const images = new Map<Clan, any>()

images.set(Clan.Toad, Images.cardToads)
images.set(Clan.Rabbit, Images.cardRabbits)
images.set(Clan.Fox, Images.cardFoxes)
images.set(Clan.Raccoon, Images.cardRaccoons)
images.set(Clan.Lizard, Images.cardLizards)

function getSpaceClanCount(game:GameView,number:number,clan:Clan){
  let clanCounter:number
  let space:Space
  switch(number){
    case 1 :
      clanCounter = 7
      break
    case 2 :
      clanCounter = 7
      break
    case 3 :
      clanCounter = 6
      break
    case 4 :
      clanCounter = 3
      break
    default :
      return 0
  }
  for (const placedTile of game.forest) {
    for (let i = 0; i < 4; i++){
      space = tiles[placedTile.tile][i]
      if(isTroop(space) && space.clan === clan && space.size === number) clanCounter--
    }
  }
  for (const tile of game.river) {
    if(tile){
      for (let i = 0; i < 4; i++){
       space = tiles[tile][i]
        if(isTroop(space) && space.clan === clan && space.size === number) clanCounter--
      }
    }
  }
  return clanCounter
}

export default ClanCard