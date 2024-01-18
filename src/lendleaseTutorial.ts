import { Marker, getBlock } from "mlogjs:world";

const marker = Marker.shapeText({
  id: 30,
  x: 648,
  y: 365,
  replace: false,
});
marker.radius = 3 * 8;

print`출처를 알 수 없는 신호에서 랜드리스 지원을 제안하고 있습니다.
창고를 설치하여 [accent]랜드리스 신호에 응답[]해보세요.`;
//print("@lendlease-tutorial");
marker.flushText({ fetch: true });
while (true) {
  const valut = getBlock.building(648, 365);
  if (valut) {
    marker.visible = false;
  }
}
