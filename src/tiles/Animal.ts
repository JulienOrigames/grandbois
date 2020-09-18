enum Animal {
  Toad = 'Toad', Rabbit = 'Rabbit', Fox = 'Fox', Raccoon = 'Raccoon', Lizard = 'Lizard', Bear = 'Bear', None = 'None'
}

export default Animal

export function isAnimal(item: any): item is Animal {
  return animals.indexOf(item) !== -1
}

export const animals = Object.values(Animal) as Animal[]