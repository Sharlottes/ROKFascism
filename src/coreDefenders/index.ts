/**
 * 1. 각 코어엔 수비군이 존재한다.
 * 1-1. 코어 등급에 따라 수비군의 종류와 수가 다르다.
 * 2. 수비군은 코어의 범위 내에 적이 존재한다면 소환된다. (코어 위치에 유닛 소환 후 urader 사용)
 * 2-1. 수비군은 코어에 종속적이다. 수비군이 코어 범위 밖으로 벗어날려 한다면 역소환된다.
 * 2-2. 수비군이 주변 적을 모두 무찔러 주변에 적이 존재치 않다면 역소환된다.
 * 4. 역소환된 수비군은 체력이 회복되지만, 죽은 수비군은 다시 소환되지 않는다.
 * 4-1. 수비군은 시간에 따라 자동 보충된다.
 */

import * as world from "mlogjs:world";


world.effect.blockFall(0, 0, Blocks.coreShard)
world.setRate(1000);

const flagMap = {
  detector: 100,
  defenders: 15,
};
const detectorUnit: UnitSymbol = Units.mega;
const memoryBuilds = new MutableArray([
  getBuilding("cell1"),
  getBuilding("cell2"),
  getBuilding("cell3"),
  getBuilding("cell4"),
  getBuilding("cell5"),
]); // 512..   3 items per core, total 135 cores -> need 405 memory...
const memoryItemAmount = 3;
const defendersSet = new MutableArray([1, Units.dagger, 5, Units.dagger, 5, 2, Units.nova, 5, 1, Units.dagger, 5]);
const defendersIdx = new MutableArray([
  0,
  1 + (defendersSet[0] as number) * 2,
  1 + (defendersSet[1 + (defendersSet[0] as number) * 2] as number) * 2,
]);
const teams = new MutableArray([Teams.blue, Teams.crux, Teams.green, Teams.malis, Teams.sharded]);
setup();
while (true) {
  update();
}

function setup() {}

function update() {
  let mi = 0;
  let curMem = memoryBuilds[mi];
  for (let i = 0, u = 0; i < teams.size; i++) {
    if (u + memoryItemAmount > 128) {
      curMem = memoryBuilds[++mi];
      u = 0;
    }

    const memory = new Memory(curMem, 128);
    const team = unchecked(teams[i]) as TeamSymbol;
    const coreAmount = world.fetch.coreCount(team);
    for (let j = 0; j < coreAmount; j++, u += memoryItemAmount) {
      const core = world.fetch.core(team, j);
      const memCoreX = memory[u];
      const memCoreY = memory[u + 1];
      const isSpawned = memory[u + 2];

      // validate memory
      if ((memCoreX == undefined && memCoreY == undefined) || (core.x !== memCoreX && core.y !== memCoreY)) {
        memory[u] = core.x;
        memory[u + 1] = core.y;
        memory[u + 2] = 0;
        continue;
      }

      const coreIdx = resolveCoreIdx(core.type);
      const unit = getDetector(team, core.x, core.y);
      unitBind(unit);

      const e = unitRadar({
        filters: ["enemy", "enemy", "enemy"],
        order: true,
        sort: "distance",
      });
      const hasEnemy = e !== undefined;

      if (hasEnemy) {
        if (isSpawned) continue;
        // * if enemy is in range, spawn defenders

        print("there are fuck'in enemy!!");
        world.flushMessage.announce(1);
        spawnUnits(coreIdx, core.x, core.y, core.team);
        unitControl.unbind();
        memory[u + 2] = 1;
      } else {
        // * if no enemy, remove all defenders

        let initUnit = undefined;
        while (true) {
          const ally = unitRadar({
            filters: ["ally", "ally", "ally"],
            order: true,
            sort: "distance",
          });
          if (ally == undefined) {
            memory[u + 2] = 0;
            break;
          }
          if (ally.flag !== flagMap.defenders) continue;
          if (initUnit == undefined) initUnit = ally;
          world.setProp(ally).x = 0;
          world.setProp(ally).y = 0;
          world.setProp(ally).health = -1;
        }
      }
    }
  }
}

function dst(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function resolveCoreIdx(coreType: BlockSymbol): number {
  switch (coreType) {
    case Blocks.coreShard:
      return 0;
    case Blocks.coreNucleus:
      return 1;
    case Blocks.coreFoundation:
      return 2;
  }
}

function getDetector(team: TeamIdentifier, x: number, y: number) {
  const unitAmount = world.fetch.unitCount(team, detectorUnit);
  for (let i = 0; i < unitAmount; i++) {
    const unit = world.fetch.unit(team, i);

    if (unit.flag == flagMap.detector && dst(unit.x, unit.y, x, y) < 4) {
      return unit;
    }
  }
}

function spawnUnits(coreIdx: number, x: number, y: number, team: TeamIdentifier) {
  const amount = defendersIdx[coreIdx];
  for (let i = defendersIdx[coreIdx] + 2; i < defendersIdx[coreIdx] + 2 + amount * 2; i += 2) {
    const type = unchecked(defendersSet[i]) as UnitSymbol;
    const amount = unchecked(defendersSet[i + 1]) as number;
    for (let j = 0; j < amount; j++) {
      const unit = world.spawnUnit({
        type,
        x,
        y: y - 3,
        team,
      });
      world.setProp(unit).flag = flagMap.defenders;
      world.setProp(unit).speed = 0;
    }
  }
}
