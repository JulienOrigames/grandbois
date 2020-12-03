import Tile, {Bear, Clearing} from './Tile'
import Clan from '../clans/Clan'

const {Fox, Toad, Raccoon, Rabbit, Lizard} = Clan

export const TileStart: Tile = [Clearing, Clearing, Clearing, Clearing]
export const Tile1: Tile = [Bear, {clan: Raccoon, size : 3}, {clan: Toad, size : 1}, {clan: Toad, size : 1}]
export const Tile2: Tile = [{clan: Toad, size : 3}, Bear, {clan: Rabbit, size : 1}, {clan: Rabbit, size : 1}]
export const Tile3: Tile = [{clan: Rabbit, size : 1}, {clan: Lizard, size : 2}, Bear, {clan: Rabbit, size : 2}]
export const Tile4: Tile = [{clan: Fox, size : 1}, {clan: Lizard, size : 1}, {clan: Lizard, size : 2}, Bear]
export const Tile5: Tile = [Bear, {clan: Fox, size : 3}, {clan: Fox, size : 1}, {clan: Raccoon, size : 2}]
export const Tile6: Tile = [Clearing, {clan: Raccoon, size : 3}, {clan: Raccoon, size : 1}, {clan: Fox, size : 3}]
export const Tile7: Tile = [Clearing, {clan: Raccoon, size : 3}, {clan: Rabbit, size : 3}, {clan: Raccoon, size : 1}]
export const Tile8: Tile = [Clearing, {clan: Toad, size : 4}, {clan: Fox, size : 2}, {clan: Fox, size : 2}]
export const Tile9: Tile = [Clearing, {clan: Toad, size : 2}, {clan: Lizard, size : 4}, {clan: Toad, size : 2}]
export const Tile10: Tile = [Clearing, {clan: Rabbit, size : 2}, {clan: Fox, size : 1}, {clan: Fox, size : 4}]
export const Tile11: Tile = [Clearing, {clan: Rabbit, size : 4}, {clan: Raccoon, size : 2}, {clan: Raccoon, size : 2}]
export const Tile12: Tile = [{clan: Raccoon, size : 4}, Clearing, {clan: Toad, size : 1}, {clan: Toad, size : 2}]
export const Tile13: Tile = [{clan: Rabbit, size : 2}, Clearing, {clan: Lizard, size : 2}, {clan: Rabbit, size : 4}]
export const Tile14: Tile = [{clan: Toad, size : 3}, Clearing, {clan: Fox, size : 3}, {clan: Fox, size : 1}]
export const Tile15: Tile = [{clan: Raccoon, size : 1}, Clearing, {clan: Fox, size : 4}, {clan: Raccoon, size : 2}]
export const Tile16: Tile = [{clan: Fox, size : 2}, Clearing, {clan: Fox, size : 1}, {clan: Rabbit, size : 4}]
export const Tile17: Tile = [{clan: Toad, size : 3}, Clearing, {clan: Lizard, size : 1}, {clan: Lizard, size : 3}]
export const Tile18: Tile = [{clan: Raccoon, size : 4}, {clan: Lizard, size : 1}, {clan: Lizard, size : 3}, Clearing]
export const Tile19: Tile = [{clan: Rabbit, size : 2}, {clan: Rabbit, size : 1}, {clan: Toad, size : 4}, Clearing]
export const Tile20: Tile = [{clan: Lizard, size : 4}, {clan: Lizard, size : 1}, {clan: Fox, size : 2}, Clearing]
export const Tile21: Tile = [{clan: Raccoon, size : 2}, {clan: Raccoon, size : 3}, {clan: Lizard, size : 3}, Clearing]
export const Tile22: Tile = [{clan: Fox, size : 3}, {clan: Rabbit, size : 3}, {clan: Rabbit, size : 2}, Clearing]
export const Tile23: Tile = [{clan: Rabbit, size : 2}, {clan: Raccoon, size : 2}, {clan: Rabbit, size : 3}, Clearing]
export const Tile24: Tile = [{clan: Toad, size : 3}, {clan: Toad, size : 1}, {clan: Raccoon, size : 3}, Clearing]
export const Tile25: Tile = [{clan: Fox, size : 1}, {clan: Fox, size : 3}, Clearing, {clan: Lizard, size : 3}]
export const Tile26: Tile = [{clan: Lizard, size : 1}, {clan: Lizard, size : 4}, Clearing, {clan: Raccoon, size : 2}]
export const Tile27: Tile = [{clan: Toad, size : 4}, {clan: Toad, size : 1}, Clearing, {clan: Rabbit, size : 2}]
export const Tile28: Tile = [{clan: Fox, size : 2}, {clan: Toad, size : 3}, Clearing, {clan: Fox, size : 2}]
export const Tile29: Tile = [{clan: Toad, size : 2}, {clan: Lizard, size : 3}, Clearing, {clan: Lizard, size : 2}]
export const Tile30: Tile = [{clan: Raccoon, size : 4}, {clan: Raccoon, size : 1}, {clan: Lizard, size : 1}, {clan: Lizard, size : 2}]
export const Tile31: Tile = [{clan: Rabbit, size : 3}, {clan: Lizard, size : 2}, {clan: Lizard, size : 2}, {clan: Rabbit, size : 1}]
export const Tile32: Tile = [{clan: Fox, size : 4}, {clan: Fox, size : 2}, {clan: Toad, size : 1}, {clan: Toad, size : 1}]
export const Tile33: Tile = [{clan: Rabbit, size : 1}, {clan: Toad, size : 2}, {clan: Toad, size : 3}, {clan: Rabbit, size : 1}]
export const Tile34: Tile = [{clan: Toad, size : 2}, {clan: Toad, size : 2}, {clan: Raccoon, size : 1}, {clan: Raccoon, size : 3}]
export const Tile35: Tile = [{clan: Raccoon, size : 1}, {clan: Rabbit, size : 3}, {clan: Rabbit, size : 3}, {clan: Raccoon, size : 1}]
export const Tile36: Tile = [{clan: Fox, size : 3}, {clan: Fox, size : 1}, {clan: Lizard, size : 3}, {clan: Lizard, size : 1}]

export const tiles: Tile[] = [
  TileStart,
  Tile1, Tile2, Tile3, Tile4, Tile5, Tile6, Tile7, Tile8, Tile9, Tile10,
  Tile11, Tile12, Tile13, Tile14, Tile15, Tile16, Tile17, Tile18, Tile19, Tile20,
  Tile21, Tile22, Tile23, Tile24, Tile25, Tile26, Tile27, Tile28, Tile29, Tile30,
  Tile31, Tile32, Tile33, Tile34, Tile35, Tile36
]