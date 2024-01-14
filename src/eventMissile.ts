import { spawnUnit, setProp, setBlock, flushMessage, fetch } from "mlogjs:world";

function angleDeg(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const theta = Math.atan(dy / dx);
  if (dx < 0) return theta + 180;
  if (dy < 0) return theta + 360;
  return theta;
}

function fire(fromX: number, fromY: number, toX: number, toY: number) {
  const deg = angleDeg(fromX, fromY, toX, toY);
  const mega = spawnUnit({
    type: Units.mega,
    team: Teams.crux,
    x: fromX,
    y: fromY,
    rotation: deg,
  });
  setProp(mega).payloadType = missileType;
  setProp(mega).rotation = deg;

  unitBind(mega);
  unitControl.payDrop();

  while (true) {
    const missile = unitRadar({ filters: ["ally", "any", "any"], order: true, sort: "distance" });
    if (missile) {
      setProp(missile).speed = 10000;
      setProp(missile).x = fromX;
      setProp(missile).y = fromY;
      setProp(missile).rotation = deg;
      unitBind(missile);
      unitControl.approach({ x: toX, y: toY, radius: 1 });
      setProp(mega).health = 0;
      break;
    }
  }
}

const koreaCores = new MutableArray([
  495, 517, 475.5, 508.5, 598.5, 398.5, 519.5, 430.5, 477.5, 351.5, 637.5, 356.5, 648.5, 378.5, 511, 447, 494.5, 495.5,
  527.5, 459.5, 470.5, 447.5, 508.5, 397.5, 464.5, 342.5, 611.5, 447.5, 603.5, 354.5, 544.5, 539.5, 459.5, 235.5,
]);
function missileRaid() {
  const originX = 467;
  const originY = 541;
  for (let i = 0; i < koreaCores.size; i += 2) {
    const x = koreaCores[i];
    const y = koreaCores[i + 1];
    const dist = Math.len(originY - y, originX - x);
    if (dist >= 168) continue;
    fire(originX, originY, x, y);
    wait(0.25);
  }
  wait(5);
}

let missileType;
function setup() {
  setBlock.block({ team: Teams.crux, x: 400, y: 400, to: Blocks.scathe, rotation: 0 });
  const scathe = fetch.build(Teams.crux, fetch.buildCount(Teams.crux, Blocks.scathe) - 1, Blocks.scathe);
  setProp(scathe).carbide = 100;
  setProp(scathe).water = 100;
  control.shoot({ building: scathe, x: 400, y: 410, shoot: true });
  while (true) {
    const missile = radar({ building: scathe, filters: ["ally", "flying", "any"], order: true, sort: "distance" });
    if (missile) {
      missileType = missile.type;
      setProp(scathe).health = 0;
      setProp(missile).health = 0;
      break;
    }
  }
  missileRaid();
  missileRaid();
  missileRaid();
}

function update() {}

setup();
while (true) {
  update();
}
