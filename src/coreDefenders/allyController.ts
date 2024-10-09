import * as world from "mlogjs:world";
world.setRate(1000);
const detectorUnit: UnitSymbol = Units.mega;
const teams = new MutableArray([Teams.blue, Teams.crux, Teams.green, Teams.malis, Teams.sharded]);
const flagMap = {
  detector: 100,
  defenders: 15,
};
while (true) {
  for (let i = 0; i < teams.size; i++) {
    const team = unchecked(teams[i]) as TeamSymbol;
    const coreAmount = world.fetch.unitCount(team);
    for (let j = 0; j < coreAmount; j++) {
      const core = world.fetch.core(team, j);

      const unit = getDetector(team, core.x, core.y);
      let initUnit = undefined;
      while (true) {
        unitBind(unit);
        const ally = unitRadar({
          filters: ["ally", "ally", "ally"],
          order: true,
          sort: "distance",
        });
        if (ally == undefined || ally === initUnit) break;
        if (initUnit == undefined) initUnit = ally;
        if (ally.flag !== flagMap.defenders) continue;
        unitControl.unbind();
        unitBind(ally);
        if (dst(core.x, core.y, ally.x, ally.y) > unit.range - 1.5) {
          world.setProp(ally).x = core.x;
          world.setProp(ally).y = core.y - 3;
        } else {
          unitControl.stop();
        }
        unitControl.unbind();
      }
    }
  }
}

function getDetector(team: TeamIdentifier, x: number, y: number) {
  const unitAmount = world.fetch.unitCount(team, detectorUnit);
  for (let i = 0; i < unitAmount; i++) {
    const unit = world.fetch.unit(team, i);

    if (unit.flag == flagMap.detector && dst(unit.x, unit.y, x, y) < 4) {
      return unit;
    }
  }
}

function dst(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
