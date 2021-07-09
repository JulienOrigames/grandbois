/** @jsxImportSource @emotion/react */
import {css, Global, Theme, ThemeProvider} from '@emotion/react'
import GameView from '@gamepark/grandbois/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useContrastTheme, useGame} from '@gamepark/react-client'
import {Header, LoadingScreen} from '@gamepark/react-components'
import normalize from 'emotion-normalize'
import 'moment/locale/fr'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import GrandboisBox from './material/grandbois3D.png'
import Images from './material/Images'
import ImagesLoader from './util/ImageLoader'
import {backgroundColor, textColor} from './util/Styles'

function App() {
  const theme = useContrastTheme()
  const game = useGame<GameView>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      <ThemeProvider theme={theme}>
        <Global styles={(theme: Theme) => [globalStyle, themeStyle(theme)]}/>
        <LoadingScreen display={loading} gameBox={GrandboisBox} css={[textColor(theme)]}
                       author="Frédéric Guérard" artist="Camille Chaussy" publisher={['The Flying Games', 'Origames']} developer="Origames"/>
        {!loading && <GameDisplay game={game!}/>}
        <Header><HeaderText loading={loading}/></Header>
        <Menu/>
        <FailuresDialog/>
        <FullscreenDialog/>
      </ThemeProvider>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}

export default App

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

  #root picture img {
    width: auto;
  }
`

const themeStyle = (theme: Theme) => css`
  #root {
    ${backgroundColor(theme)}
  }
`