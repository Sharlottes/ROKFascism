import * as world from "mlogjs:world";
const teams = new MutableArray([Teams.blue, Teams.crux, Teams.green, Teams.malis, Teams.sharded]);

let u = 0;
for (let i = 0; i < teams.size; i++) {
  const team = unchecked(teams[i]) as TeamSymbol;
  const coreAmount = world.fetch.coreCount(team);
  for (let j = 0; j < coreAmount; j++) {
    const core = world.fetch.core(team, j);
    const marker = world.Marker.text({
      id: u + 100,
      x: core.x,
      y: core.y - 2,
      replace: true,
    });
    marker.fontSize = 1;
    u++;
  }
}
while (true) {
  let u = 0;
  for (let i = 0; i < teams.size; i++) {
    const team = unchecked(teams[i]) as TeamSymbol;
    const coreAmount = world.fetch.coreCount(team);
    for (let j = 0; j < coreAmount; j++) {
      // ? print current defenders amount...may need Memory block
      const marker = world.Marker.of(u + 100);
      print("h");
      marker.flushText({ fetch: true });
      u++;
    }
  }
}
