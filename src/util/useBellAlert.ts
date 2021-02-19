import {useOptions, usePlayerId, usePlayers, useSound} from '@gamepark/workshop'
import {useEffect, useState} from 'react'
import {isActive} from '../Rules'
import bellSound from '../sounds/bell.mp3'
import GameView from '../types/GameView'
import TowerColor from '../clans/TowerColor'

//const REMINDER_FREQUENCY = 30000

export function useBellAlert(game: GameView) {
  const playerId = usePlayerId<TowerColor>()
  const options = useOptions()
  const players = usePlayers<TowerColor>()
  const [sound] = useSound(bellSound)
  const [playerWasActive, setPlayerWasActive] = useState(false)
  //const [reminders, setReminders] = useState<NodeJS.Timeout[]>([])

  useEffect(() => {
    if (!playerId) return
    const active = isActive(game, playerId)
    if (!active) {
      //reminders.forEach(timeout => clearTimeout(timeout))
      //setReminders([])
    } else if (!playerWasActive) {
      if (!document.hasFocus()) {
        sound.play().catch((error) => console.warn('Sound could not be played', error))
      }
      /*const time = players.find(player => player.id === playerId)?.time
      if (options?.speed === GameSpeed.RealTime && time) {
        setReminders(setupReminders(time, sound))
      }*/
    }
    setPlayerWasActive(active)
  }, [game, playerId, players, sound, playerWasActive, options])
}


