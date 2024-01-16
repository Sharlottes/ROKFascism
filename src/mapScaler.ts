import { setRule } from "mlogjs:world";

const scaleMap = {
  default: [292, 208, 471, 336],
  a: [292, 208, 471, 351],
  b: [292, 208, 471, 442],
  c: [292, 208, 471, 704],
};
const currentTransform = new MutableArray(scaleMap.default);
updateMapArea(currentTransform);

function loop() {}

function scaleUpMapArea([x, y, w, h]: number[]) {
  for (let i = 1, m = 100; i <= m; i++) {
    const t = i / m;

    currentTransform[0] = lerp(currentTransform[0], x, t);
    currentTransform[1] = lerp(currentTransform[1], y, t);
    currentTransform[2] = lerp(currentTransform[2], w, t);
    currentTransform[3] = lerp(currentTransform[3], h, t);
    delay(0.1);
    updateMapArea(currentTransform);
  }
}

function updateMapArea([x, y, width, height]: MutableArray<number> | number[]) {
  setRule.mapArea({ x, y, width, height });
}

function lerp(from: number, to: number, prog: number) {
  return from * (1 - prog) + to * prog;
}

function delay(sec: number) {
  let lastTime = Vars.time;
  while (Vars.time - lastTime < sec * 1000) {}
}

while (true) {
  loop();
}
