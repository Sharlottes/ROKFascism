import { Marker, getBlock } from "mlogjs:world";

const marker1 = Marker.shapeText({
  id: 31,
  x: 641.5,
  y: 384.5,
  replace: false,
});
const marker2 = Marker.shapeText({
  id: 32,
  x: 641.5,
  y: 357.5,
  replace: false,
});
const marker3 = Marker.shapeText({
  id: 33,
  x: 652.5,
  y: 376.5,
  replace: false,
});
marker1.radius = 8 * 2;
marker2.radius = 8 * 2;
marker3.radius = 8 * 2;
marker1.fontSize = 0.7;
marker2.fontSize = 0.7;
marker3.fontSize = 0.7;

print`[lightgray]전쟁의 혼란으로 군수물자가 전국 곳곳에 퍼져있습니다.
이 아이템포드에 달린 언로더로 [accent]자원을 빠르게 확보[]하세요.[]`;
marker1.flushText({ fetch: true });
print`[lightgray]전쟁의 혼란으로 군수물자가 전국 곳곳에 퍼져있습니다.
이 아이템포드에 달린 언로더로 [accent]자원을 빠르게 확보[]하세요.[]`;
marker2.flushText({ fetch: true });
print`[lightgray]전쟁의 혼란으로 군수물자가 전국 곳곳에 퍼져있습니다.
이 아이템포드에 달린 언로더로 [accent]자원을 빠르게 확보[]하세요.[]`;
marker3.flushText({ fetch: true });

while (true) {
  const itemPod1 = getBlock.building(642, 385);
  if (itemPod1 == undefined) marker1.visible = false;
  const itemPod2 = getBlock.building(641, 357);
  if (itemPod2 == undefined) marker2.visible = false;
  const itemPod3 = getBlock.building(653, 376);
  if (itemPod3 == undefined) marker3.visible = false;
}
