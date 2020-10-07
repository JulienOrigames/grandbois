import TowerColor from './clans/TowerColor'
import Player from './types/Player'

export const setupTutorial = (setupPlayers: (players?: (number | { tower?: TowerColor }[])) => (Player[])) => ({
  players: setupPlayers(),
  tutorial: true
})

export function resetTutorial() {
  localStorage.removeItem('grandbois')
  window.location.reload()
}

export const tutorialMoves = [
  // Automatic Tutorial Draft Phase

]