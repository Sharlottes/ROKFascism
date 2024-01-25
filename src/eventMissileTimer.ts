import { localePrint, Marker, setFlag, setRate } from "mlogjs:world";

let lastTime = Vars.time;
const ATTACK_DELAY = 3 * 60 * 1000;

const marker = Marker.text({
  id: 70,
  x: 0,
  y: 0,
  replace: false,
});
marker.autoscale = true;
marker.drawLayer = 1000;

const cameraXSensor = getVar<symbol>("@cameraX");
const cameraYSensor = getVar<symbol>("@cameraY");
const cameraHeightSensor = getVar<symbol>("@cameraHeight");

setRate(1000);
function update() {
  const ms = ATTACK_DELAY - (Vars.time - lastTime);
  const minute = Math.idiv(ms, 1000 * 60) % 60;
  const second = Math.idiv(ms, 1000) % 60;
  const decisec = Math.idiv(ms, 100) % 10;

  const clientUnit = getVar("@clientUnit") as AnyUnit;
  const cameraX = sensor<number>(cameraXSensor, clientUnit);
  const cameraY = sensor<number>(cameraYSensor, clientUnit);
  const cameraHeight = sensor<number>(cameraHeightSensor, clientUnit);

  marker.pos = { x: cameraX, y: cameraY + cameraHeight / 2.5 };

  //print("@missile-timer");
  localePrint("missile-timer");
  print`[accent]${minute}:${second}.${decisec} []`;
  marker.flushText({ fetch: false });
  printFlush();

  if (Vars.time - lastTime >= ATTACK_DELAY) {
    lastTime = Vars.time;

    setFlag("missile-cooltime-end", true);
  }
}

while (true) {
  update();
  wait(1e-4);
}
