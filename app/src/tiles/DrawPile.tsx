import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import GameView from '@gamepark/grandbois/GameView'
import {cardHeight, cardStyle, cardWidth, drawpileTop, riverLeft} from '../util/Styles'
import {useTranslation} from 'react-i18next'
import TileCard from './TileCard'

const DrawPile: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  return <>
    {
      !game.over &&
      <>
        {[...Array(Math.min(game.deck, drawPileMaxSize))].map((_, index) =>
          <TileCard key={index} css={[cardStyle, css`
                                                  top: ${drawPileCardY(index)}%;
                                                  left: ${drawPileCardX(index)}%;
                                                  z-index:2;
                                                `]}/>)}
          <div css={drawPileTooltip} data-tip={t('Number of remaining tiles: {nbDeck}', {nbDeck: game.deck})}/>
          { game.deck && <div css={nbStyle} data-tip={t('Number of remaining tiles: {nbDeck}', {nbDeck: game.deck})}>{game.deck}</div> }
      </>
    }
  </>
}

export const drawPileMaxSize = 8

export const drawPileCardX = (index: number) => riverLeft + index * 0.05
export const drawPileCardY = (index: number) => drawpileTop + index * 0.05

const drawPileTooltip = css`
  position: absolute;
  top: ${drawPileCardY(0)}%;
  left: ${drawPileCardX(0)}%;
  width: ${cardWidth + drawPileMaxSize * 0.05}%;
  height: ${cardHeight}%;
  z-index:2;
`

const nbStyle = css`
  position: absolute;
  top: ${drawpileTop + 1}%;
  left: ${riverLeft + cardWidth - 2}%;
  z-index:3;
  font-weight: bold;
  color: #fff381;
  text-shadow: 0 0 0.01em black;
  font-size: 2em;
  text-align:right;
`

export default DrawPile