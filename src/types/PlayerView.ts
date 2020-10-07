import Player from './Player'

type PlayerView = Omit<Player, 'Clan' > & {

}

export default PlayerView