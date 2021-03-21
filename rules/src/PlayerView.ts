import Player from './Player'

type PlayerView = Omit<Player, 'clans'>

export default PlayerView

export function isPlayer(player: Player | PlayerView): player is Player {
  return (player as Player).clans !== undefined
}