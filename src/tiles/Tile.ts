import Animal from './Animal'

type Tile = {
  quarters: { [key in Animal]?: number }
}

export default Tile
