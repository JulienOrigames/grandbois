import Player from './Player'

type PlayerView = Omit<Player, 'clan' > & {

}

export default PlayerView