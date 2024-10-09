import { Marker, effect, getBlock, localePrint, setProp, setRule, spawnUnit } from "mlogjs:world";
const ITEMS_PER_ARR = 8;
const LOADOUT_SETUP_COUNT = 3;

// [unitId, unitTypeId, state, markerId, lastTime, delay, x, y]
const lendleaseDatasetArr = new DynamicArray<any>(ITEMS_PER_ARR * LOADOUT_SETUP_COUNT);
const originX = 480;
const originY = 130;
setRule.unitCap(10);

function setupLendlease({
  x,
  y,
  unitType,
  delay,
  markerId,
}: {
  x: number;
  y: number;
  unitType: UnitSymbol;
  delay: number;
  markerId: number;
}) {
  const marker = Marker.text({ id: markerId, x, y, replace: false });
  localePrint("lendlease-idle");
  marker.flushText({ fetch: true });

  lendleaseDatasetArr.push(undefined);
  lendleaseDatasetArr.push(unitType.id);
  lendleaseDatasetArr.push("idle");
  lendleaseDatasetArr.push(markerId);
  lendleaseDatasetArr.push(Vars.time);
  lendleaseDatasetArr.push(delay);
  lendleaseDatasetArr.push(x);
  lendleaseDatasetArr.push(y);
}

function loopLendlease(i: number) {
  const unit = lendleaseDatasetArr[i] as AnyUnit | undefined;
  const state = lendleaseDatasetArr[i + 2];
  const markerId = lendleaseDatasetArr[i + 3];
  const lastTime = lendleaseDatasetArr[i + 4];
  const delay = lendleaseDatasetArr[i + 5];
  const x = lendleaseDatasetArr[i + 6];
  const y = lendleaseDatasetArr[i + 7];

  const marker = Marker.of(markerId);
  const valut = getBlock.building(x, y);
  const isValid = valut != undefined && valut.type == Blocks.vault;

  // control unit
  switch (state) {
    case "idle": {
      localePrint("lendlease-idle");
      marker.flushText({ fetch: true });
      if (isValid) {
        lendleaseDatasetArr[i + 2] = "waiting";
      }
      break;
    }
    case "moving": {
      if (!isValid) {
        lendleaseDatasetArr[i + 2] = "back";
        break;
      }
      localePrint("lendlease-moving");
      print`${Math.floor(Math.len(unit.x - x, unit.y - y))}km`;
      marker.flushText({ fetch: true });

      unitBind(unit);
      unitControl.move(x, y);
      if (Math.len(unit.x - x, unit.y - y) > 1) break;
      lendleaseDatasetArr[i + 2] = "landing";
      break;
    }
    case "landing": {
      if (!isValid) {
        lendleaseDatasetArr[i + 2] = "back";
        break;
      }

      givelendlease(unit, valut);
      lendleaseDatasetArr[i + 2] = "back";
      lendleaseDatasetArr[i + 4] = Vars.time;
      break;
    }
    case "back": {
      if (!isValid) break;
      unitBind(unit);
      unitControl.move(originX, originY);
      if (Math.len(unit.x - originX, unit.y - originY) < 1) {
        setProp(unit).health = 0;
        lendleaseDatasetArr[i + 2] = "waiting";
      }
    }
    case "waiting": {
      if (!isValid) {
        lendleaseDatasetArr[i + 2] = "idle";
        break;
      }

      const lastTimeToDelay = delay - (Vars.time - lastTime);
      const second = Math.floor(((lastTimeToDelay / 1000) % 60) * 100) / 100;
      const minute = Math.floor((lastTimeToDelay / (1000 * 60)) % 60);

      localePrint("lendlease-waiting");
      print`[accent]${minute}:${second}[]`;
      marker.flushText({ fetch: true });

      if (lastTimeToDelay < 0) {
        const unitTypeId = lendleaseDatasetArr[i + 1];
        const unit = spawnUnit({ x: originX, y: originY, type: lookup.unit(unitTypeId), team: Teams.derelict });
        setProp(unit).speed = 18.75;
        setProp(unit).health = 200;
        lendleaseDatasetArr[i] = unit;
        lendleaseDatasetArr[i + 2] = "moving";
      }
      break;
    }
  }
}

function givelendlease(unit: AnyUnit, valut: AnyBuilding) {
  setProp(valut).silicon = valut.silicon + 350;
  setProp(valut).graphite = valut.graphite + 350;
  effect.lightBlock({
    x: valut.x,
    y: valut.y,
    size: valut.size + 1,
    color: packColor(1, 0.82, 0.49, 0.75),
  });

  unitControl.move(valut.x - 2.5, valut.y - 0.5);
  wait(1);
  for (let i = 0; i < 2; i++) {
    spawnUnit({
      type: Units.nova,
      x: unit.x,
      y: unit.y,
      team: Teams.sharded,
    });
    effect.spawn(unit.x, unit.y);
    wait(0.25);
  }
  for (let i = 0; i < 3; i++) {
    spawnUnit({
      type: Units.dagger,
      x: unit.x,
      y: unit.y,
      team: Teams.sharded,
    });
    effect.spawn(unit.x, unit.y);
    wait(0.25);
  }
}

setupLendlease({
  x: 648,
  y: 365,
  unitType: Units.quad,
  delay: 50 * 1000,
  markerId: 19,
});
setupLendlease({
  x: 456,
  y: 334,
  unitType: Units.quad,
  delay: 40 * 1000,
  markerId: 20,
});
setupLendlease({
  x: 469,
  y: 507,
  unitType: Units.quad,
  delay: 30 * 1000,
  markerId: 21,
});
while (true) {
  for (let i = 0; i < lendleaseDatasetArr.length; i += ITEMS_PER_ARR) {
    loopLendlease(i);
  }
}
