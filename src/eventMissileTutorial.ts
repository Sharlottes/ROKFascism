import { fetch, getBlock, Marker } from "mlogjs:world";

const array = new DynamicArray<number>(36);
const coreAmount = fetch.coreCount(Teams.sharded);

function setup() {
  for (let i = 0; i < coreAmount; i++) {
    const core = fetch.core(Teams.sharded, i);
    array.push(core.x);
    array.push(core.y);
    const marker = Marker.shapeText({ id: i, x: core.x, y: core.y, replace: false });
    marker.visible = false;
    marker.radius = core.size * 8;
    marker.fontSize = 1.5;
    print`북한의 미사일 공격으로 지역이 초토화 되었습니다. 
[accent]지역을 수복하세요![]`;
    //localePrint("@restoration-marker");
    marker.flushText({ fetch: true });
  }
}

function update() {
  for (let i = 0; i < array.length; i += 2) {
    const x = array[i];
    const y = array[i + 1];

    const core = getBlock.building(x, y);
    const marker = Marker.of(Math.idiv(i, 2));
    marker.visible = core.team == 2;
  }
}

setup();
while (true) {
  update();
}
