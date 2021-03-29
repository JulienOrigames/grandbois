enum TowerColor {
  White = 1, Black, Blue, Brown
}

export default TowerColor

export const towerColors = Object.values(TowerColor).filter(isTowerColor)

function isTowerColor(arg: string | TowerColor): arg is TowerColor {
  return typeof arg === 'number'
}