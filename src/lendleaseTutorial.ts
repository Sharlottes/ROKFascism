import { Marker, getBlock, localePrint } from "mlogjs:world";

const marker = Marker.shapeText({
  id: 30,
  x: 648,
  y: 365,
  replace: false,
});
marker.radius = 3 * 8;

localePrint("lendlease-tutorial");
marker.flushText({ fetch: true });
while (true) {
  const valut = getBlock.building(648, 365);
  if (valut) {
    marker.world = false;
  }
}
