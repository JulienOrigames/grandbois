import Player from './Player'

type PlayerView = Omit<Player, 'clans' > & {

}

export default PlayerView