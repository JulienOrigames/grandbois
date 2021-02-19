import Game from './Game'
import GameView from './GameView'
import Player from './Player'
import PlayerView from './PlayerView'

export function isGameView(game: Game | GameView): game is GameView {
  return typeof game.deck === 'number'
}

export function isPlayer(player: Player | PlayerView): player is Player {
  return (player as Player).clans !== undefined
}