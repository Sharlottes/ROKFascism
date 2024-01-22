import { spawnUnit, setProp, setBlock, fetch, flushMessage, getFlag, setFlag } from "mlogjs:world";

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
  setProp(missile).speed = (dist * 8) / (60 * 4);
  setProp(missile).x = fromX;
  setProp(missile).y = fromY;
  setProp(missile).rotation = deg;
}

const originX = 467;
const originY = 541;
function missileRaid() {
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
  //print("@intro-one");
  print`반갑습니다 지휘관님.
북의 기습적인 공격으로 전국적인 피해가 발생했습니다.
이에 따라 지휘관님이 군과 행정에 이은 전권을 모두 지니게 되었습니다.
이 사태에 대한 주변국의 도움을 받는걸 기대하긴 어렵습니다. 즉시 국토를 수복하고 반격에 나섭시오.`;
  flushMessage.toast(10);
  printFlush();
  wait(11);
  //print("@intro-two");
  print`북한의 다연장 탄두 미사일 공격은 매우 치명적이지만 그 주기가 짧지 않습니다.
미사일의 발사 지점은 개성인 것으로 파악됩니다.
미사일이 남은 기지를 마저 파괴시키기 전에 가능한 빨리 개성을 공격해야 합니다!`;
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
    missileRaid();
    setFlag("missile-cooltime-end", false);
  }
}

setup();
while (true) {
  update();
}
