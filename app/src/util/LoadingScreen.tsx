/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faLightbulb, faPaintBrush, faWrench} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FC} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import GrandboisBox from '../material/grandbois3D.png'
import Images from '../material/Images'
import {backgroundColor, textColor} from './Styles'

const LoadingScreen: FC<{ display: boolean }> = ({display}) => {
  const {t} = useTranslation()
  const theme = useTheme()
  return (
    <div css={[loadingScreenStyle, textColor(theme), backgroundColor(theme), !display && css`opacity: 0`]}>
      <img css={gameBox} src={GrandboisBox} alt={t('Name')}/>
      <h2 css={gameTitle}>{t('Name')}</h2>
      <p css={gamePeople}>
        <FontAwesomeIcon css={iconStyle} icon={faLightbulb}/>
        <Trans defaults="A game by <0>{author}</0>" values={{author: 'Frédéric Guérard'}} components={[<strong/>]}/>
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faPaintBrush}/>
        <Trans defaults="Illustrated by <0>{artist}</0>" values={{artist: 'Camille Chaussy'}} components={[<strong/>]}/>
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faWrench}/>
        <Trans defaults="Edited by <0>{editor1}</0> and <0>{editor2}</0>" values={{editor1: 'The Flying Games', editor2: 'Origames'}} components={[<strong/>]}/>
      </p>
    </div>
  )
}

const loadingScreenStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 2s;
  background-image: url(${Images.coverArtwork169});
  background-size: cover;
  background-position: center;
  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  > * {
    z-index: 1;
  }
`

const gameBox = css`
  position: relative;
  width: 46.64em;
  height: 66em;
  margin-top: 8em;
  margin-bottom: 3em;
`

const gameTitle = css`
  font-size: 5em;
  margin: 0;
`
const gamePeople = css`
  font-size: 3em;
`
const iconStyle = css`
  min-width: 6em;
  position: relative;
`
export default LoadingScreen