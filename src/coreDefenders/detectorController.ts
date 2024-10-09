import * as world from "mlogjs:world";
world.setRate(1000);
const flagMap = {
  detector: 100,
  defenders: 15,
};
const detectorUnit: UnitSymbol = Units.mega;
const teams = new MutableArray<TeamIdentifier>([Teams.blue, Teams.crux, Teams.green, Teams.malis, Teams.sharded]);

setup();
while (true) {
  update();
}

function setup() {
  for (let i = 0; i < teams.size; i++) {
    const team = unchecked(teams[i]) as TeamSymbol;
    const coreAmount = world.fetch.coreCount(team);
    for (let j = 0; j < coreAmount; j++) {
      const core = world.fetch.core(team, j);
      const unit = world.spawnUnit({
        type: detectorUnit,
        x: core.x,
        y: core.y,
        team,
      });
      world.applyStatus.apply("disarmed", unit, 123456789012345670.0);
      world.setProp(unit).armor = 12345678901234567890.0;
      world.setProp(unit).health = 123456789012345670.0;
      world.setProp(unit).speed = 0;
      unitBind(unit);
      unitControl.flag(flagMap.detector);
      unitControl.unbind();
    }
  }
}
function update() {
  for (let ti = 0; ti < teams.size; ti++)
    for (let i = 0, m = world.fetch.unitCount(teams[ti], detectorUnit); i < m; i++) {
      const unit = world.fetch.unit(teams[ti], i);
      if (unit.flag != flagMap.detector) continue;
      world.setProp(unit).health = 123456789012345670.0;
      unitBind(unit);

      let [coreX, coreY, core] = [undefined, undefined, undefined];
      while (true) {
        const [found, x, y, c] = unitLocate.building({ group: "core", enemy: false });
        if (!found) break;
        if (dst(x, y, unit.x, unit.y) > 3) break;
        [coreX, coreY, core] = [x, y, c];
        break;
      }
      if (core == undefined)
        while (true) {
          const [found, x, y, c] = unitLocate.building({ group: "core", enemy: true });
          if (!found) break;
          if (dst(x, y, unit.x, unit.y) > 3) break;
          [coreX, coreY, core] = [x, y, c];
          break;
        }

      world.setProp(unit).team = core.team;
      world.setProp(unit).x = coreX;
      world.setProp(unit).y = coreY;
      unitControl.unbind();
    }
}
function dst(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
