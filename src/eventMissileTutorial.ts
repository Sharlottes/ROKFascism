import { fetch, flushMessage, getBlock, localePrint, Marker } from "mlogjs:world";

const array = new DynamicArray<number>(36);
const coreAmount = fetch.coreCount(Teams.sharded);

function setup() {
  for (let i = 0; i < coreAmount; i++) {
    const core = fetch.core(Teams.sharded, i);
    array.push(core.x);
    array.push(core.y);
    const marker = Marker.shapeText({ id: i, x: core.x, y: core.y, replace: false });
    marker.world = false;
    marker.radius = core.size * 8;
    marker.fontSize = 1.5;
    localePrint("restoration-marker");
    marker.flushText({ fetch: true });
  }
}

function update() {
  for (let i = 0; i < array.length; i += 2) {
    const x = array[i];
    const y = array[i + 1];

    const core = getBlock.building(x, y);
    const marker = Marker.of(Math.idiv(i, 2));
    marker.world = core.team == 2;
  }
}

setup();
while (true) {
  update();
}
