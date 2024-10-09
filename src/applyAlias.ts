import * as world from "mlogjs:world";
const ITEMS_PER_ARR = 4; // markerId, x, y, done]
const ITEM_COUNT = 4;
const datasetArr = new DynamicArray<any>(ITEMS_PER_ARR * ITEM_COUNT);

let curX = 0,
  curY = 0;
function spawn(unitType: UnitSymbol, amount: number) {
  for (let i = 0; i < amount; i++) {
    world.spawnUnit({
      type: unitType,
      x: curX,
      y: curY - 1,
      team: Teams.derelict,
    });
  }
}
function addAliasPoint(x: number, y: number) {
  curX = x;
  curY = y;
  world.setBlock.block({
    x,
    y,
    to: Blocks.duo,
    team: Teams.derelict,
    rotation: 0,
  });

  const marker = world.Marker.shapeText({
    id: markerIdx,
    x: x,
    y: y,
    replace: false,
  });
  marker.radius = 8 * 3;
  marker.fontSize = 0.7;
  print`고립된 부대를 유닛과 접촉시켜 지휘권을 확보하세요.`;
  marker.flushText({ fetch: true });

  datasetArr.push(markerIdx);
  datasetArr.push(x);
  datasetArr.push(y);
  datasetArr.push(false);

  markerIdx++;
}

let markerIdx = 71;
addAliasPoint(605, 467);
spawn(Units.dagger, 5);
addAliasPoint(502, 363);
spawn(Units.dagger, 5);
spawn(Units.mace, 2);
spawn(Units.nova, 2);
addAliasPoint(621, 528);
spawn(Units.atrax, 7);
addAliasPoint(541, 514);
spawn(Units.fortress, 3);
spawn(Units.nova, 2);

while (true) {
  for (let i = 0; i < datasetArr.size; i += ITEMS_PER_ARR) {
    if (datasetArr[i + 3]) continue;
    const markerId = datasetArr[i];
    const x = datasetArr[i + 1];
    const y = datasetArr[i + 2];
    const building = world.getBlock.building(x, y);

    const unit = radar({
      building,
      filters: ["ground", "enemy", "enemy"],
      order: true,
      sort: "distance",
    });
    if (unit == undefined || unit.team === Teams.derelict.id) continue;
    if (Math.len(unit.x - x, unit.y - y) > 3) {
      continue;
    }

    while (true) {
      const unit = radar({ building, filters: ["ground", "ally", "ally"], order: true, sort: "distance" });

      if (unit == undefined) break;
      world.setProp(unit).health = unit.maxHealth;
      world.setProp(unit).team = Teams.sharded;
      unitBind(unit);
      unitControl.unbind();
    }
    world.setProp(building).health = -1;
    const marker = world.Marker.of(markerId);
    marker.remove();
    datasetArr[i + 3] = true;
  }
}
