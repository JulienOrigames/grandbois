enum Clan {
  Toad = 1, Rabbit, Fox, Raccoon, Lizard
}

export default Clan

export const clans = Object.values(Clan).filter(isClan)

function isClan(arg: string | Clan): arg is Clan {
  return typeof arg === 'number'
}