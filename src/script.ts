import * as world from "mlogjs:world";

const tmpArr = new DynamicArray<number>([17]);
const arr = new DynamicArray<number>([17]);

function createMarker(core: AnyBuilding) {
  const id = (core.x << 16) | (core.y & 0xffff);
  const marker = world.Marker.shapeText({ id, x: core.x, y: core.y, replace: true });
  marker.visible = false;
  marker.radius = core.size * 8;
  marker.fontSize = 1.5;
  marker.text = "북한의 미사일 공격으로 지역이 초토화 되었습니다.\n[accent]지역을 수복하세요![]";
  marker.visible = true;
  return id;
}

function refresh() {
  tmpArr.fill(-1);
  for (let i = 0; i < world.fetch.coreCount(Teams.crux); i++) {
    const core = world.fetch.core(Teams.crux, i);
    if (core.y >= 541) continue;
    const id = createMarker(core);
    tmpArr[i] = id;
  }
  for (let i = 0; i < arr.length; i++) {
    world.Marker.of(arr[i]).visible = false;
    arr[i] = tmpArr[i];
  }
}

while (true) {
  refresh();
}
