import { spawnUnit, setProp, setBlock, fetch, flushMessage, getFlag, setFlag, localePrint } from "mlogjs:world";

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
    x: 0,
    y: 0,
    rotation: deg,
  });
  setProp(mega).payloadType = missileType;
  setProp(mega).rotation = deg;

  unitBind(mega);
  unitControl.payDrop();

  const missile = unitRadar({ filters: ["ally", "any", "any"], order: true, sort: "distance" });
  setProp(mega).health = 0;
  if (!missile) return;
  const dist = Math.len(fromX - toX, fromY - toY);
  setProp(missile).speed = dist * 0.25;
  setProp(missile).x = fromX;
  setProp(missile).y = fromY;
  setProp(missile).rotation = deg;
}

const originX = 467;
const originY = 541;
function missileRaid() {
  localePrint("missile-notify");
  flushMessage.notify();
  printFlush();

  const coreAmount = fetch.coreCount(Teams.sharded);
  const missileAmount = Math.min(3 * coreAmount, 15);
  for (let i = 0; i < missileAmount; i++) {
    const core = fetch.core(Teams.sharded, i % coreAmount);
    fire(originX, originY, core.x, core.y);
    wait(0.1);
  }
}

let missileType: UnitSymbol;
function getMissileType() {
  setBlock.block({ team: Teams.crux, x: 300, y: 210, to: Blocks.scathe, rotation: 0 });
  const scathe = fetch.build(Teams.crux, fetch.buildCount(Teams.crux, Blocks.scathe) - 1, Blocks.scathe);
  setProp(scathe).carbide = 100;
  setProp(scathe).water = 100;
  control.shoot({ building: scathe, x: 310, y: 220, shoot: true });
  while (true) {
    const missile = radar({ building: scathe, filters: ["ally", "flying", "any"], order: true, sort: "distance" });
    if (!missile) continue;
    if (Math.len(300 - missile.x, 210 - missile.y) > 20) continue;
    missileType = missile.type;
    setProp(scathe).health = 0;
    setProp(missile).health = 0;
    break;
  }
}

function intro() {
  localePrint("intro-one");
  flushMessage.toast(10);
  printFlush();
  wait(11);
  setFlag("start-quest-processor", true);
  localePrint("intro-two");
  flushMessage.toast(10);
  printFlush();
  wait(11);
  print``;
}

function setup() {
  getMissileType();
  missileRaid();
  missileRaid();
  missileRaid();
  intro();
}

function update() {
  const isCooltimeEnd = getFlag("missile-cooltime-end");
  if (isCooltimeEnd) {
    setFlag("missile-cooltime-end", false);
    missileRaid();
  }
}

setup();
while (true) {
  update();
}
