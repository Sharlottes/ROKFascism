import { Marker, fetch } from "mlogjs:world";

wait(15);
const marker1 = Marker.shapeText({
  id: 34,
  x: 622,
  y: 407,
  replace: false,
});
const marker2 = Marker.shapeText({
  id: 35,
  x: 546,
  y: 373,
  replace: false,
});
const redColor = packColor(1, 0, 0, 1);
print`[red]적 공수부대 접근중![]`;
marker1.radius = 32;
marker1.color = redColor;
marker1.fontSize = 2;
marker1.flushText({ fetch: true });
print`[red]적 공수부대 접근중![]`;
marker2.radius = 32;
marker2.color = redColor;
marker2.fontSize = 2;
marker2.flushText({ fetch: true });

while (true) {
  for (let i = 0, m = fetch.unitCount(Teams.crux); i < m; i++) {
    const unit = fetch.unit(Teams.crux, i);
    if (unit.type != Units.oct) continue;

    if (Math.len(unit.x - 622, unit.y - 407) < 1) {
      marker1.visible = false;
    }
    if (Math.len(unit.x - 546, unit.y - 373) < 1) {
      marker2.visible = false;
    }
  }
}
