import {createGameStore} from '@gamepark/workshop'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import GrandBoisRules from './Rules'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createGameStore('grandbois', GrandBoisRules)}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
