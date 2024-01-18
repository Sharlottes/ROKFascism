import { spawnUnit, setProp, setBlock, fetch, flushMessage } from "mlogjs:world";

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
  print("[red]경고![] 미사일 공습 임박!");
  //print("@missile-notify");
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

let lastTime = Vars.time;
const ATTACK_DELAY = 3 * 60 * 1000;
function printLastTime(now: number, lastTime: number) {
  const ms = ATTACK_DELAY - (now - lastTime);
  const second = (ms / 1000) % 60;
  const minute = (ms / (1000 * 60)) % 60;
  //print("@missile-timer");
  print("다음 미사일 공습:");
  print`[accent]${Math.floor(minute)}:${Math.floor(second * 10) / 10}[]`;
  flushMessage.mission();
  printFlush();
}

function intro() {
  //print("@intro-one");
  print`반갑습니다 지휘관님.
북의 기습적인 공격으로 전국적인 피해가 발생했습니다.
이에 따라 지휘관님이 군과 행정에 이은 전권을 모두 지니게 되었습니다.
이 사태에 대한 주변국의 도움을 받는걸 기대하긴 어렵습니다. 즉시 국토를 수복하고 반격에 나섭시오.`;
  flushMessage.toast(10);
  wait(11);
  //print("@intro-two");
  print`북한의 다연장 탄두 미사일 공격은 매우 치명적이지만 그 주기가 짧지 않습니다.
미사일의 발사 지점은 개성인 것으로 파악됩니다.
미사일이 남은 기지를 마저 파괴시키기 전에 가능한 빨리 개성을 공격해야 합니다!`;
  flushMessage.toast(10);
  wait(11);
  print``;
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
  intro();
}

function update() {
  printLastTime(Vars.time, lastTime);
  if (Vars.time - lastTime >= ATTACK_DELAY) {
    lastTime = Vars.time;
    printLastTime(Vars.time, Vars.time);
    missileRaid();
    printLastTime(Vars.time, Vars.time);
  }
}

setup();
while (true) {
  update();
}
