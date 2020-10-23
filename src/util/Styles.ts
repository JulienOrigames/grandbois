import {css, keyframes} from '@emotion/core'
import Theme, {LightTheme} from '../Theme'

export const screenRatio = 16 / 9
export const cardScale = 0.7
export const boardWidth = 66
export const headerHeight = 7
export const topMargin = 2
export const bottomMargin = 3

export const cardHeight = 23 * cardScale  // percentage of playing area cardHeight
export const cardRatio = 1
export const cardWidth = cardHeight * cardRatio / screenRatio  // percentage of playing area cardWidth
export const spaceHeight = cardHeight / 2
export const spaceWidth = cardWidth / 2

export const drawpileTop = headerHeight + topMargin
export const riverLeft = 1
export const riverTop = headerHeight + topMargin * 2 + 1 + cardHeight

export const forestTop = headerHeight + topMargin
export const forestLeft = cardWidth + topMargin + riverLeft
export const forestWidth = 67
export const forestHeight = 90
export const forestRatioY = 100 / forestHeight
export const forestRatioX = 100 / forestWidth
export const forestCardWidth = cardWidth * forestRatioX
export const forestCardHeight = cardHeight * forestRatioY
export const forestSpaceWidth = forestCardWidth/2
export const forestSpaceHeight = forestCardHeight/2
export const forestCenterLeft = 50 - forestSpaceWidth
export const forestCenterTop = 50 - forestSpaceHeight

export const centerLeft = forestLeft + forestWidth/2 - spaceWidth
export const centerTop = forestTop + forestHeight/2 - spaceHeight

export const tokenWidth = 4
export const tokenHeight = tokenWidth * screenRatio
export const empireCardRatio = 343 / 400
export const empireCardWidth = 9
export const empireCardLeftMargin = 1
export const empireCardBottomMargin = 10
export const developmentCardVerticalShift = 2.6
export const constructedCardLeftMargin = 1.3
export const constructedCardBottomMargin = empireCardBottomMargin + 12.4
export const playerPanelWidth = 19.5
export const playerPanelHeight = 10
export const playerPanelMargin = 1.5
export const areasBorders = 0.3
export const areasCardMargin = 1
export const areaWidth = (cardWidth + areasCardMargin) + 1
export const marginBetweenCardRows = 4
export const areasCardX = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin
export const areasX = areasCardX - areasBorders * 5 / screenRatio
export const constructedCardY = (index: number) => 100 - cardHeight - constructedCardBottomMargin - index * developmentCardVerticalShift
export const playerPanelY = (index: number) => headerHeight + playerPanelMargin + index * (playerPanelHeight + playerPanelMargin)
export const playerPanelRightMargin = 1
export const gameOverDelay = 10

export const platformUri = process.env.REACT_APP_PLATFORM_URI || 'http://localhost:3000'
export const discordUri = 'https://discord.gg/nMSDRag'

export const cardStyle = css`
  position: absolute;
  width: ${cardWidth}%;
  height: ${cardHeight}%;
`

export const forestCardStyle = css`
  position: absolute;
  width: ${forestCardWidth}%;
  height: ${forestCardHeight}%;
`

export const forestCardX = (x: number) => forestCenterLeft + ( forestSpaceWidth * x )
export const forestCardY = (y: number) => forestCenterTop + ( forestSpaceHeight * y )

export const placedCardX = (x: number) => centerLeft + ( spaceWidth * x )
export const placedCardY = (y: number) => centerTop + ( spaceHeight * y )

export const mod = (n:number, m:number) => ((n % m) + m) % m




export const getAreaCardY = (row: number) => 100 - cardHeight - bottomMargin - (cardHeight + marginBetweenCardRows) * row

export const getAreasStyle = (row: number, fullWidth: boolean, isValidTarget = false) => css`
  position: absolute;
  width: ${fullWidth ? 'auto' : `${areaWidth}%`};
  height: ${cardHeight + areasBorders * 10}%;
  left: ${areasX}%;
  right: ${fullWidth ? '1%' : 'auto'};
  top: ${getAreaCardY(row) - areasBorders * 5}%;
  border-radius: ${areasBorders * 5}em;
  border-style: solid;
  border-width: ${areasBorders}em;
  z-index: ${isValidTarget ? 10 : 'auto'};
`

export const areaCardStyle = css`
  position: absolute;
  z-index: 1;
`

export const getCardFocusTransform = css`
  z-index: 100;
  transform: translate(${50 * 100 / cardWidth - 50}%, ${50 * 100 / cardHeight - 50}%) scale(3) !important;
`

export const glow = (color: string, from = '5px', to = '30px') => keyframes`
  from { box-shadow: 0 0 ${from} ${color}; }
  to { box-shadow: 0 0 ${to} ${color}; }
`

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const textColor = (theme: Theme) => css`
  color: ${theme.color === LightTheme ? '#333' : '#FFF'};
  fill: ${theme.color === LightTheme ? '#333' : '#FFF'};
`

export const backgroundColor = (theme: Theme) => css`
  &:before {
    background-color: ${theme.color === LightTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 30, 0.7)'};
    transition: background-color 1s ease-in;
  }
`

export const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

export const popupFixedBackgroundStyle = css`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

export const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  transition: all .5s ease;
`
export const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`
export const hidePopupOverlayStyle = (boxTop: number, boxLeft: number) => css`
  top: ${boxTop}%;
  left: ${boxLeft}%;
  width: 0;
  height: 0;
  overflow: hidden;
`

export const popupStyle = css`
  position: absolute;
  text-align: center;
  max-height: 70%;
  z-index : 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
  
  &:hover{
      box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,.5);
    }
  & > h2 {
    font-size: 5em;
    margin:0;
  }
  & > p {
    font-size: 4em;
    margin: 2% 0;
  }
  & > button {
    font-size: 4em;
  }
`

export const popupPosition = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const popupLightStyle = css`
  background-color: #e9e9e9;
  color: #082b2b;
  border: solid 1em #082b2b;
`

export const popupDarkStyle = css`
  background-color: #082b2b;
  color: #d4f7f7;
  border: solid 1em #d4f7f7;
`
export const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;
  &:hover{
    cursor: pointer;
    color: #26d9d9;
  }
`