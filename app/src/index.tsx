import Grandbois from '@gamepark/grandbois/Grandbois'
import {GrandboisOptionsDescription} from '@gamepark/grandbois/GrandboisOptions'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import GrandboisView from './GrandboisView'
import translations from './translations.json'
import GrandboisTutorial from './tutorial/Tutorial'

setupTranslation(translations)

ReactDOM.render(
  <StrictMode>
    <GameProvider game="grandbois" Rules={Grandbois} RulesView={GrandboisView} optionsDescription={GrandboisOptionsDescription} tutorial={GrandboisTutorial}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
