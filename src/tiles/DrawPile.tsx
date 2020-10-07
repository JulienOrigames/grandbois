import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '../types/GameView'
import {cardHeight, cardStyle, cardWidth, drawpileTop} from '../util/Styles'
import ReactTooltip from 'react-tooltip'
import {useTranslation} from 'react-i18next'
import TileCard from './TileCard'

const DrawPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  return <>
    {[...Array(Math.min(game.deck, drawPileMaxSize))].map((_, index) =>
      <TileCard key={index} css={[cardStyle, css`
      position: absolute;
      top: ${drawPileCardY(index)}%;
      left: ${drawPileCardX(index)}%;
    `]}/>)}
    <div css={drawPileTooltip} data-tip />
    <ReactTooltip css={css`font-size:2em;`} type='info' effect='solid' place='right' backgroundColor='green' >
      <span>{t('Nb de tuiles : {nbDeck}',{nbDeck:game.deck})}  </span>
    </ReactTooltip>
  </>
}

export const drawPileMaxSize = 8

export const drawPileCardX = (index: number) => index * 0.05
export const drawPileCardY = (index: number) => drawpileTop + index * 0.05

const drawPileTooltip = css`
  position: absolute;
  top: ${drawPileCardY(0)}%;
  left: ${drawPileCardX(0)}%;
  width: ${cardWidth + drawPileMaxSize*0.05}%;
  height: ${cardHeight}%;
`

export default DrawPile