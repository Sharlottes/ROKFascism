import { Marker, effect, getBlock, setProp, setRule, spawnUnit } from "mlogjs:world";
const ITEMS_PER_ARR = 8;
const LOADOUT_SETUP_COUNT = 2;

// [unitId, unitTypeId, state, markerId, lastTime, delay, x, y]
const loadoutDatasetArr = new DynamicArray<any>(ITEMS_PER_ARR * LOADOUT_SETUP_COUNT);
const originX = 480;
const originY = 130;
setRule.unitCap(10);

function setupLoadout({
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
  Marker.text({ id: markerId, x, y, replace: false });
  loadoutDatasetArr.push(undefined);
  loadoutDatasetArr.push(unitType.id);
  loadoutDatasetArr.push("idle");
  loadoutDatasetArr.push(markerId);
  loadoutDatasetArr.push(Vars.time);
  loadoutDatasetArr.push(delay);
  loadoutDatasetArr.push(x);
  loadoutDatasetArr.push(y);
}

function loopLoadout(i: number) {
  const unit = loadoutDatasetArr[i] as AnyUnit | undefined;
  const state = loadoutDatasetArr[i + 2];
  const markerId = loadoutDatasetArr[i + 3];
  const lastTime = loadoutDatasetArr[i + 4];
  const delay = loadoutDatasetArr[i + 5];
  const x = loadoutDatasetArr[i + 6];
  const y = loadoutDatasetArr[i + 7];

  const marker = Marker.of(markerId);
  const valut = getBlock.building(x, y);
  const isValid = valut != undefined && valut.type == Blocks.vault;
  if (!isValid) {
    loadoutDatasetArr[i + 2] = "idle";
  }

  // control unit
  switch (state) {
    case "idle": {
      print`waiting to receive landout signal...`;
      marker.flushText({ fetch: true });
      if (isValid) {
        loadoutDatasetArr[i + 2] = "waiting";
      }
      break;
    }
    case "moving": {
      if (!isValid) {
        loadoutDatasetArr[i + 2] = "back";
        break;
      }
      print`[accent]lendlease is incomming[]: ${Math.floor(Math.len(unit.x - x, unit.y - y))}m`;
      marker.flushText({ fetch: true });

      unitBind(unit);
      unitControl.move(x, y);
      if (Math.len(unit.x - x, unit.y - y) > 1) break;
      loadoutDatasetArr[i + 2] = "landing";
      break;
    }
    case "landing": {
      givelendlease(unit, valut);
      loadoutDatasetArr[i + 2] = "back";
      loadoutDatasetArr[i + 4] = Vars.time;
      break;
    }
    case "back": {
      if (!isValid) break;
      unitBind(unit);
      unitControl.move(originX, originY);
      if (Math.len(unit.x - originX, unit.y - originY) < 1) {
        setProp(unit).health = 0;
        loadoutDatasetArr[i + 2] = "waiting";
      }
    }
    case "waiting": {
      const lastTimeToDelay = delay - (Vars.time - lastTime);
      const second = Math.floor(((lastTimeToDelay / 1000) % 60) * 100) / 100;
      const minute = Math.floor((lastTimeToDelay / (1000 * 60)) % 60);
      print`next lendlease is incomming in [accent]${minute}:${second}[]`;
      marker.flushText({ fetch: true });

      if (lastTimeToDelay < 0) {
        const unitTypeId = loadoutDatasetArr[i + 1];
        const unit = spawnUnit({ x: originX, y: originY, type: lookup.unit(unitTypeId), team: Teams.derelict });
        setProp(unit).speed = 2.5;
        setProp(unit).health = 200;
        loadoutDatasetArr[i] = unit;
        loadoutDatasetArr[i + 2] = "moving";
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

setupLoadout({
  x: 648,
  y: 365,
  unitType: Units.quad,
  delay: 50 * 1000,
  markerId: 18,
});
while (true) {
  for (let i = 0; i < loadoutDatasetArr.length; i += ITEMS_PER_ARR) {
    loopLoadout(i);
  }
}
