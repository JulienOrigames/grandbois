import {css} from '@emotion/core'
import {faMinusSquare, faPlusSquare, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useActions, useFailures, usePlayerId} from '@gamepark/workshop'
import {useTheme} from 'emotion-theming'
import {TFunction} from 'i18next'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'
import Move from './moves/Move'
import {isOver} from './Rules'
import Theme, {LightTheme} from './Theme'
import {resetTutorial} from './Tutorial'
import GameView from './types/GameView'
import Button from './util/Button'
import {
  closePopupStyle, discordUri, hidePopupOverlayStyle, platformUri, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupStyle, showPopupOverlayStyle
} from './util/Styles'
import tutorialArrowDark from './util/tutorial-arrow-dark.png'
import tutorialArrowLight from './util/tutorial-arrow-light.png'
import TowerColor from './clans/TowerColor'

const TutorialPopup: FunctionComponent<{ game: GameView }> = ({game}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const [failures] = useFailures()
  const playerId = usePlayerId<TowerColor>()
  const actions = useActions<Move, TowerColor>()
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  const previousActionNumber = useRef(actionsNumber)
  const [tutorialIndex, setTutorialIndex] = useState(0)
  const [tutorialEnd, setTutorialEnd] = useState(false)
  const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
  const [hideLastTurnInfo, setHideLastTurnInfo] = useState(false)
  const toggleTutorialEnd = () => {
    setTutorialEnd(!tutorialEnd)
  }
  const moveTutorial = (deltaMessage: number) => {
    setTutorialIndex(tutorialIndex + deltaMessage)
    setTutorialDisplay(true)
  }
  const resetTutorialDisplay = () => {
    setTutorialIndex(0)
    setTutorialDisplay(true)
  }
  const tutorialMessage = (index: number) => {
    let currentStep = actionsNumber
    while (!tutorialDescription[currentStep]) {
      currentStep--
    }
    return tutorialDescription[currentStep][index]
  }
  useEffect(() => {
    if (previousActionNumber.current > actionsNumber) {
      setTutorialDisplay(false)
    } else if (tutorialDescription[actionsNumber]) {
      resetTutorialDisplay()
    }
    previousActionNumber.current = actionsNumber
  }, [actionsNumber])
  useEffect(() => {
    if (failures.length) {
      setTutorialIndex(tutorialDescription[actionsNumber].length - 1)
      setTutorialDisplay(true)
    }
  }, [actionsNumber, failures])
  const currentMessage = tutorialMessage(tutorialIndex)
  const displayPopup = tutorialDisplay && currentMessage && !failures.length
  return (
    <>
      <div css={[popupOverlayStyle, displayPopup ? showPopupOverlayStyle : hidePopupOverlayStyle(85, 90), style]}
           onClick={() => setTutorialDisplay(false)}>
        <div css={[popupStyle, theme.color === LightTheme ? popupLightStyle : popupDarkStyle, displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
             onClick={event => event.stopPropagation()}>
          <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>
          {currentMessage && <h2>{currentMessage.title(t)}</h2>}
          {currentMessage && <p>{currentMessage.text(t)}</p>}
          {tutorialIndex > 0 && <Button css={buttonStyle} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
          <Button onClick={() => moveTutorial(1)}>{t('OK')}</Button>
        </div>
      </div>
      {
        !displayPopup && tutorialDescription.length > actionsNumber &&
        <Button css={resetStyle} onClick={() => resetTutorialDisplay()}>{t('Show Tutorial')}</Button>
      }
      {
        currentMessage && currentMessage.arrow &&
        <img alt='Arrow pointing toward current tutorial interest' src={theme.color === LightTheme ? tutorialArrowLight : tutorialArrowDark} draggable="false"
             css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
      }
      {
        game.deck === 0 && !hideLastTurnInfo &&
        <div css={[popupStyle, popupPosition(lastTurnInfo), theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => setHideLastTurnInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
          <h2>{lastTurnInfo.title(t)}</h2>
          <p>{lastTurnInfo.text(t)}</p>
          <Button onClick={() => setHideLastTurnInfo(true)}>{t('OK')}</Button>
        </div>
      }
      {
        isOver(game) &&
        <div css={[popupStyle, popupPosition(tutorialEndGame), tutorialEnd && buttonsPosition, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}>
          <div css={closePopupStyle} onClick={() => toggleTutorialEnd()}><FontAwesomeIcon icon={tutorialEnd ? faPlusSquare : faMinusSquare}/></div>
          {!tutorialEnd &&
          <>
            <h2>{tutorialEndGame.title(t)}</h2>
            <p>{tutorialEndGame.text(t)}</p>
          </>
          }
          <Button css={buttonStyle} onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
          <Button css={buttonStyle} onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
          <Button onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
        </div>
      }
    </>
  )
}

const style = css`
  background-color: transparent;
`

export const popupPosition = ({boxWidth, boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
  transition-property: width, top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  width: ${boxWidth}%;
  top: ${boxTop}%;
  left: ${boxLeft}%;
  transform: translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? '-50%' : arrow.angle % 360 === 0 ? '0%' : '-100%'});
`

export const buttonsPosition = css`
  top: 86%;
  width: 80%;
`

const resetStyle = css`
  position: absolute;
  text-align: center;
  bottom: 48%;
  right: 2%;
  font-size: 3.5em;
`

const buttonStyle = css`
  margin-right: 1em;
`

const arrowStyle = (angle: number) => css`
  position: absolute;
  transform: rotate(${angle}deg);
  will-change: transform;
  z-index: 102;
  transition-property: top, left, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
`

const showArrowStyle = (top: number, left: number) => css`
  top: ${top}%;
  left: ${left}%;
  width: 20%;
`

const hideArrowStyle = css`
  top: 90%;
  left: 90%;
  width: 0;
`

export const hidePopupStyle = css`
  top: 85%;
  left: 90%;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: solid 0 #FFF;
  font-size: 0;
`

type TutorialStepDescription = {
  title: (t: TFunction) => string
  text: (t: TFunction) => string
  boxTop: number
  boxLeft: number
  boxWidth: number
  arrow?: {
    angle: number
    top: number
    left: number
  }
}

const tutorialDescription: TutorialStepDescription[][] = [
  [
    {
      title: (t: TFunction) => t('Welcome to Grandbois tutorial'),
      text: (t: TFunction) => t('In Grandbois, you are leading an secret clan in the forest. You must cover your opponent’s spaces and expand the forest. The least covered clan who has best placed their watchtower will get the most golden chesnuts!'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Your Secret Clan'),
      text: (t: TFunction) => t('This is your secret clan. Hold the click on this tile to look at it. Make sure no one is looking behind your back.'),
      boxTop: 67,
      boxLeft: 70,
      boxWidth: 60,
      arrow: {
        angle: 180,
        top: 67,
        left: 82
      }
    },
    {
      title: (t: TFunction) => t('Your opponents'),
      text: (t: TFunction) => t('In this tutorial, you play against 2 opponents controlled by the machine. Each secretly plays as one of the 5 clans of the forest: Rabbits, Toads, Foxes, Lizards and Raccoons.'),
      boxTop: 35,
      boxLeft: 40.5,
      boxWidth: 60,
      arrow: {
        angle: 90,
        top: 27,
        left: 66
      }
    },
    {
      title: (t: TFunction) => t('Goal of the game'),
      text: (t: TFunction) => t('The game consists of laying tiles to keep the forest growing. At the end the game, everyone reveals their clan and collects their golden chesnuts, depending of number of spaces occupied by their clan.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Flow of the game'),
      text: (t: TFunction) => t('Each player plays in turn, going clockwise, until every tile has been placed in the Forest.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Flow of a turn'),
      text: (t: TFunction) => t('When it’s your turn, you MUST take a tile from the River and add it to the Forest. Then, if the tile you’ve played has a Clearing, you CAN place your Watchtower on this Clearing.'),
      boxTop: 52,
      boxLeft: 50,
      boxWidth: 64,
      arrow: {
        angle: 270,
        top: 47,
        left: 6
      }
    },
    {
      title: (t: TFunction) => t('End of the game'),
      text: (t: TFunction) => t('When the last River tile has been played, and the last player has finished their turn, it’s time to score golden chestnuts. Everyone reveals their Clan card.'),
      boxTop: 24,
      boxLeft: 50,
      boxWidth: 64,
      arrow: {
        angle: 270,
        top: 17,
        left: 6
      }
    },
    {
      title: (t: TFunction) => t('Final Scoring'),
      text: (t: TFunction) => t('Each player score golden chestnuts following these 4 steps.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('+ 1 golden chestnut for each of your Clan’s spaces'),
      text: (t: TFunction) => t('Those are the visible spaces with at least one animal of your Clan on them.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('+ 2 golden chestnut per space for the largest contiguous group of your Clan’s spaces'),
      text: (t: TFunction) => t('A contiguous group includes spaces that are all orthogonally adjacent (diagonals don’t count!).'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('+ 2 golden chestnuts for each of your Clan’s spaces that is directly around your Watchtower'),
      text: (t: TFunction) => t('i.e. on the 8 squares surrounding it, including the diagonals.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('+ 1 golden chestnut for each space belonging to another Clan'),
      text: (t: TFunction) => t('Including Clans that nobody is playing, but excluding Bears) that is directly around your Watchtower.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('The player with the most golden chestnuts wins'),
      text: (t: TFunction) => t('If there is a tie, the sequence of tiebreakers is the scoring categories on the scoresheet, in that order (spaces, largest group, your clan surrounding your Watchtower, other clans surrounding your Watchtower).'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Perfect tie'),
      text: (t: TFunction) => t('In the extremely rare case that the tie persists through all of those tiebreakers, just play again!'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('Attention'),
      text: (t: TFunction) => t('The Watchtower doesn’t count as a space for your Clan.'),
      boxTop: 50,
      boxLeft: 50,
      boxWidth: 60
    },
    {
      title: (t: TFunction) => t('It’s your turn!'),
      text: (t: TFunction) => t('Choose one of the tiles from the River and add it to the Forest, respecting the following rules:'),
      boxTop: 52,
      boxLeft: 50,
      boxWidth: 64,
      arrow: {
        angle: 270,
        top: 47,
        left: 6
      }
    },
    {
      title: (t: TFunction) => t('Expand the forest'),
      text: (t: TFunction) => t('The new tile must cover at least one Forest space AND expand the Forest.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('On the top'),
      text: (t: TFunction) => t('A new tile is always played on top of the others (never under).'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Cover Animals'),
      text: (t: TFunction) => t('A space with at least one animal on it can only be covered by a space with more animals on it (whether or not they are the same). Example: You can cover a 1-Fox space with a 2-Lizard or 2-Fox space.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Do not cover Watchtowers'),
      text: (t: TFunction) => t('You cannot cover a space with a Watchtower in it.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Strong Bears'),
      text: (t: TFunction) => t('A space with a Bear can cover any space (except a Watchtower), and cannot be covered.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Clearing Spaces'),
      text: (t: TFunction) => t('A Clearing space can be covered by any space, even another Clearing.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Covered Spaces'),
      text: (t: TFunction) => t('Covered spaces no longer count; only those things in the Forest that are still visible count.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Rotating tiles'),
      text: (t: TFunction) => t('You can rotate tiles by clicking on them, either in the river or in the forest, before validating the position of your tile.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    },
    {
      title: (t: TFunction) => t('Validate your tile'),
      text: (t: TFunction) => t('Once you have placed your tile, click on the Validate button.'),
      boxTop: 50,
      boxLeft: 80,
      boxWidth: 40,
      arrow: {
        angle: 270,
        top: 43,
        left: 48
      }
    }
  ],
  [
    {
      title: (t: TFunction) => t('Play your watchtower ?'),
      text: (t: TFunction) => t('After placing your tile, if you have not already placed your Watchtower, you can do so, ONLY on a Clearing of the tile that you just placed.'),
      boxTop: 55,
      boxLeft: 16,
      boxWidth: 30,
      arrow: {
        angle: 90,
        top: 50,
        left: 27
      }
    },
    {
      title: (t: TFunction) => t('Play your watchtower ?'),
      text: (t: TFunction) => t('You can also wait to place your watchtower later on a tile that contains a Clearing later in the game. You have only one Watchtower so pay attention to its timing!'),
      boxTop: 55,
      boxLeft: 16,
      boxWidth: 30,
      arrow: {
        angle: 90,
        top: 50,
        left: 27
      }
    }
  ]
]

const lastTurnInfo = {
  title: (t: TFunction) => t('Last turn!'),
  text: (t: TFunction) => t('This is the last turn! It’s time to score as many gold chestnuts as possible.'),
  boxTop: 50,
  boxLeft: 50,
  boxWidth: 70
}

const tutorialEndGame = {
  title: (t: TFunction) => t('Congratulations!'),
  text: (t: TFunction) => t('You have finished your first game! You can now play with your friends, or meet other players via our chat room on Discord.'),
  boxTop: 81,
  boxLeft: 53,
  boxWidth: 87
}

export default TutorialPopup