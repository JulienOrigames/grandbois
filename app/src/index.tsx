import GrandBoisRules from '@gamepark/grandbois/Rules'
import {createGameStore} from '@gamepark/react-client'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import GrandboisTutorial from './tutorial/Tutorial'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('grandbois', GrandBoisRules, {tutorial: GrandboisTutorial})}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
