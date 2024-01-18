import { effect, fetch, setProp, spawnUnit } from "mlogjs:world";

const dropShips = new DynamicArray<any>(8);

let stack = 0;
function drop(
  [fromX, fromY]: [number, number],
  [toX, toY]: [number, number],
  team: TeamSymbol,
  unit: UnitSymbol,
  amount: number
) {
  const dropShip = spawnUnit({
    type: Units.oct,
    team,
    x: fromX,
    y: fromY,
  });
  unitBind(dropShip);
  unitControl.flag(stack);
  dropShips.push(toX);
  dropShips.push(toY);
  dropShips.push(amount);
  dropShips.push(unit);

  stack++;
}

function update() {
  for (let i = 0, dropShipi = 0; i < fetch.unitCount(Teams.crux); i++) {
    const unit = fetch.unit(Teams.crux, i);
    if (unit.flag == dropShipi && unit.type == Units.oct) {
      const toX = dropShips[dropShipi * 4];
      const toY = dropShips[dropShipi * 4 + 1];
      const amount = dropShips[dropShipi * 4 + 2];
      const unitType = dropShips[dropShipi * 4 + 3] as UnitSymbol | BuildingSymbol;
      const dropShip = unit;
      if (dropShip.health <= 0) continue;
      unitBind(dropShip);
      setProp(dropShip).speed = 1.5;
      unitControl.move(toX, toY);
      dropShipi++;

      if (Math.len(dropShip.x - toX, dropShip.y - toY) > dropShip.size) continue;
      dropShips[(dropShipi - 1) * 4 + 2] = amount - 1;
      setProp(dropShip).payloadType = unitType;
      unitControl.payDrop();
      effect.spawn(dropShip.x, dropShip.y);
      if (amount - 1 <= 0) {
        effect.smokeCloud(dropShip.x, dropShip.y, packColor(0.94, 0.33, 0.33, 1));
        setProp(dropShip).x = 0;
        setProp(dropShip).y = 0;
        setProp(dropShip).health = 0;
      }
    }
  }
}

wait(15);
drop([414, 603], [622, 407], Teams.crux, Units.dagger, 20);
drop([414, 603], [546, 373], Teams.crux, Units.atrax, 10);

while (true) {
  update();
}
