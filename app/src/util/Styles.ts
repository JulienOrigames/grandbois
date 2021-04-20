import {css, keyframes, Theme} from '@emotion/react'

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
export const riverLeft = 2
export const riverTop = headerHeight + topMargin * 2 + 1 + cardHeight

export const riverAreaLeft = riverLeft / 2
export const riverAreaTop = headerHeight
export const riverAreaWidth = cardWidth + riverLeft
export const riverAreaHeight = 100 - headerHeight

export const forestTop = 0
export const forestLeft = 0
export const forestWidth = 100
export const forestHeight = 100

export const forestRatioY = 100 / forestHeight
export const forestRatioX = 100 / forestWidth
export const forestCardWidth = cardWidth * forestRatioX
export const forestCardHeight = cardHeight * forestRatioY
export const forestSpaceWidth = forestCardWidth / 2
export const forestSpaceHeight = forestCardHeight / 2
export const forestCenterLeft = 50 - forestSpaceWidth
export const forestCenterTop = 50 - forestSpaceHeight

export const centerLeft = forestLeft + forestWidth / 2 - spaceWidth
export const centerTop = forestTop + forestHeight / 2 - spaceHeight

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
export const endPlayerPanelHeight = 21
export const playerPanelMargin = 1.5
export const areasBorders = 0.3
export const areasCardMargin = 1
export const marginBetweenCardRows = 4
export const areasCardX = constructedCardLeftMargin + cardHeight * cardRatio / screenRatio + bottomMargin
export const constructedCardY = (index: number) => 100 - cardHeight - constructedCardBottomMargin - index * developmentCardVerticalShift
export const playerPanelY = (index: number) => headerHeight + playerPanelMargin + index * (playerPanelHeight + playerPanelMargin)
export const endPlayerPanelY = (index: number) => headerHeight + playerPanelMargin + index * (endPlayerPanelHeight + playerPanelMargin)
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

export const forestCardX = (x: number) => forestCenterLeft + (forestSpaceWidth * x)
export const forestCardY = (y: number) => forestCenterTop + (forestSpaceHeight * y)

export const placedCardX = (x: number, delta: number) => centerLeft + (spaceWidth * x) + delta
export const placedCardY = (y: number, delta: number) => centerTop + (spaceHeight * y) + delta

export const getCardFocusTransform = (rotation: number) => css`
  z-index: 100;
  transform: translate(${50 * 100 / cardWidth - 50}%, ${50 * 100 / cardHeight - 50}%) scale(3) rotate(${90 * rotation}deg) !important;
`

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export const textColor = (theme: Theme) => css`
  color: ${theme.light ? '#333' : '#FFF'};
  fill: ${theme.light ? '#333' : '#FFF'};
`

export const backgroundColor = (theme: Theme) => css`
  &:before {
    background-color: ${theme.light ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 30, 0.7)'};
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
  z-index: 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

  &:hover {
    box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, .5);
  }

  & > h2 {
    font-size: 5em;
    margin: 0;
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
  background-color: #f3f2db;
  color: #0e401c;
  border: solid 1em #0e401c;
`

export const popupDarkStyle = css`
  background-color: #0e401c;
  color: #f3f2db;
  border: solid 1em #f3f2db;
`
export const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;

  &:hover {
    cursor: pointer;
    color: #26d9d9;
  }
`

export const button = css`
  position: absolute;
  z-index: 100;
  left: ${51 + cardWidth * 1.5}%;
  font-size: 3.2em;
  font-weight: lighter;
  color: #EEE;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1em;
  padding: 0.3em 0.6em;

  & svg {
    margin-right: 0.3em;
  }

  &:hover, &:focus {
    outline: 0;
    transform: translateY(1px) scale(1.05);
    cursor: pointer;
  }

  &:active {
    border-style: inset;
    transform: translateY(1px);
  }
`

export const closeButton = css`
  top: ${16.5}%;
`