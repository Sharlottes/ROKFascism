import { Marker, effect, setProp, spawnUnit } from "mlogjs:world";

type State = "idle" | "moving" | "landing" | "back" | "waiting";

const ITEMS_PER_DATASET = 11;
const DATASET_SETUP_COUNT = 2;

// [unit, fromX, fromY, toX, toY, unitType, lastTime, delay, markerId, loadoutAmount, state]
const datasetArray = new DynamicArray<unknown>(ITEMS_PER_DATASET * DATASET_SETUP_COUNT);

const redColor = packColor(1, 0, 0, 1);
function setupDropship({
  from: [fromX, fromY],
  to: [toX, toY],
  unitType,
  delay,
  markerId,
  loadoutAmount,
}: {
  from: [number, number];
  to: [number, number];
  unitType: UnitSymbol;
  delay: number;
  markerId: number;
  loadoutAmount: number;
}) {
  datasetArray.push(undefined);
  datasetArray.push(fromX);
  datasetArray.push(fromY);
  datasetArray.push(toX);
  datasetArray.push(toY);
  datasetArray.push(unitType);
  datasetArray.push(Vars.time);
  datasetArray.push(delay);
  datasetArray.push(markerId);
  datasetArray.push(loadoutAmount);
  datasetArray.push("moving");
  const marker = Marker.shapeText({
    id: markerId,
    x: toX,
    y: toY,
    replace: false,
  });
  marker.radius = 32;
  marker.color = redColor;
  marker.fontSize = 2;
}

let totalLoadoutCount = 0;
function loopDropship(i: number) {
  const unit = datasetArray[i] as AnyUnit;
  const fromX = datasetArray[i + 1] as number;
  const fromY = datasetArray[i + 2] as number;
  const toX = datasetArray[i + 3] as number;
  const toY = datasetArray[i + 4] as number;
  const unitType = datasetArray[i + 5] as UnitSymbol;
  const lastTime = datasetArray[i + 6] as number;
  const delay = datasetArray[i + 7] as number;
  const markerId = datasetArray[i + 8] as number;
  const loadoutAmount = datasetArray[i + 9] as number;
  const state = datasetArray[i + 10] as State;

  const marker = Marker.of(markerId);

  if (i == 0) {
    totalLoadoutCount = loadoutAmount;
  } else {
    totalLoadoutCount += loadoutAmount;
  }

  if (unit == undefined) {
    const unit = spawnUnit({
      type: unitType,
      x: fromX,
      y: fromY,
      team: Teams.crux,
    });
    setProp(unit).speed = 1.5;
    datasetArray[i] = unit;
    return;
  } else if (unit.health <= 0) {
    marker.visible = false;
    return;
  }

  switch (state) {
    case "moving": {
      print`적 공수부대 접근중: ${Math.floor(Math.len(unit.x - toX, unit.y - toY))}km`;
      marker.flushText({ fetch: true });

      unitBind(unit);
      unitControl.move(toX, toY);
      if (Math.len(unit.x - toX, unit.y - toY) > 1) break;
      datasetArray[i + 10] = "landing";
      break;
    }
    case "landing": {
      print`적 공수부대 도착!`;
      marker.flushText({ fetch: true });
      const index = (totalLoadoutCount - loadoutAmount) * 2;
      for (let j = index; j < index + loadoutAmount * 2; j += 2) {
        const unitType = loadout[j] as UnitSymbol;
        const amount = loadout[j + 1] as number;

        for (let k = 0; k < amount; k++) {
          spawnUnit({
            type: unitType,
            x: toX,
            y: toY,
            team: Teams.crux,
          });
          effect.spawn(toX, toY);

          wait(0.25);
        }
      }

      datasetArray[i + 10] = "back";
      datasetArray[i + 6] = Vars.time;

      break;
    }
    case "back": {
      unitBind(unit);
      unitControl.move(fromX, fromY);
      if (Math.len(unit.x - fromX, unit.y - fromY) < 1) {
        datasetArray[i + 10] = "waiting";
      }
    }
    case "waiting": {
      const lastTimeToDelay = delay - (Vars.time - lastTime);
      const second = Math.floor(((lastTimeToDelay / 1000) % 60) * 100) / 100;
      const minute = Math.floor((lastTimeToDelay / (1000 * 60)) % 60);

      print`다음 공수까지: [accent]${minute}:${second}[]`;
      marker.flushText({ fetch: true });

      if (lastTimeToDelay < 0) {
        datasetArray[i + 10] = "moving";
      }
      break;
    }
  }
}

function update() {
  for (let i = 0; i < datasetArray.length; i += ITEMS_PER_DATASET) {
    loopDropship(i);
  }
}

const loadout = new MutableArray([
  // 0
  Units.dagger,
  5,
  Units.nova,
  3,
  // 1
  Units.atrax,
  2,
  Units.crawler,
  6,
]);

setupDropship({
  from: [414, 603],
  to: [622, 407],
  unitType: Units.quad,
  delay: 40 * 1000,
  markerId: 50,
  loadoutAmount: 2,
});
setupDropship({
  from: [414, 603],
  to: [546, 373],
  unitType: Units.quad,
  delay: 25 * 1000,
  markerId: 51,
  loadoutAmount: 2,
});

while (true) {
  update();
}
