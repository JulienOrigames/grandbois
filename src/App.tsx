import {css, Global} from '@emotion/core'
import React, {useEffect, useState} from 'react'
import './App.css'
import {initReactI18next, useTranslation} from 'react-i18next'
import Theme, {DarkTheme, LightTheme} from './Theme'
import i18next from 'i18next'
import ICU from 'i18next-icu'
import translations from './translations.json'
import moment from 'moment'
import 'moment/locale/fr'
import {useFailures, useGame} from '@gamepark/workshop'
import GameView from './types/GameView'
import Move from './moves/Move'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import {ThemeProvider} from 'emotion-theming'
import LoadingScreen from './util/LoadingScreen'
import GameDisplay from './GameDisplay'
import {backgroundColor, textColor} from './util/Styles'
import Button from './util/Button'
import fscreen from 'fscreen'
import Header from './Header'
import FailurePopup from './FailurePopup'
import ImagesLoader from './util/ImageLoader'
import Images from './material/Images'
import normalize from 'emotion-normalize'

i18next.use(initReactI18next).use(ICU)

const query = new URLSearchParams(window.location.search)
const locale = query.get('locale') || 'en'
const userTheme = 'userTheme'

i18next.init({
  lng: locale,
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  resources: translations
})

moment().locale(locale)

function App() {
  const {t} = useTranslation()
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem(userTheme) || DarkTheme)
  const game = useGame<GameView>()
  const [failures, clearFailures] = useFailures<Move>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const theme = {
    color: themeColor,
    switchThemeColor: () => {
      let newThemeColor = themeColor === LightTheme ? DarkTheme : LightTheme
      setThemeColor(newThemeColor)
      localStorage.setItem(userTheme, newThemeColor)
    }
  }
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      <ThemeProvider theme={theme}>
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme) ]}/>
        <LoadingScreen display={loading}/>
        {!loading && <GameDisplay game={game!}/>}
        <p css={(theme: Theme) => [portraitInfo, textColor(theme)]}>
          {t('The ideal resolution for playing is in landscape mode, in 16:9.')}
          <br/>
          <Button onClick={() => fscreen.requestFullscreen(document.getElementById('root')!)}>{t('Go to full screen')}</Button>
        </p>
        <Header game={game} loading={loading}/>
        {failures.length > 0 && <FailurePopup failures={failures} clearFailures={clearFailures}/>}
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  );
}

export default App;

const globalStyle = css`
  ${normalize};
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
    *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }
  body {
    margin: 0;
    font-family: 'Merienda One', serif;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }
  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-color: white;
    background-size: cover;
    background-position: center;
    background-image: url(${Images.coverArtwork169});
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
`

const themeStyle = (theme: Theme) => css`
  #root {
    ${backgroundColor(theme)}
  }
`

const portraitInfo = css`
    @media (min-aspect-ratio: 4/3) {
    display: none;
  }
  text-align: center;
  position: absolute;
  line-height: 1.5;
  font-size: 3.5vw;
  top: 55vw;
  left: 10%;
  right: 10%;
  & > svg {
    width: 30%;
    margin-top: 1em;
  }
`
