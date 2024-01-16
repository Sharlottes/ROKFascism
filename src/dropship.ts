function drop(fromX: number, fromY: number, toX: number, toY: number, team: TeamSymbol, unit: UnitSymbol) {
  const oct = spawnUnit({
    type: Units.oct,
    team,
    x: fromX,
    y: fromY,
  });
}
