import { flushMessage, getBlock, getFlag, setFlag, setRate } from "mlogjs:world";
import type { PartPartial } from "./@types/utils.ts";

interface Quest {
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  visible: boolean;
}
let p = 0;
const Quest = {
  keys: new MutableArray(["name", "description", "maxProgress", "progress", "visible"]),
  create({
    name,
    description,
    maxProgress,
    progress = 0,
    visible = false,
  }: PartPartial<Quest, "progress" | "visible">) {
    unchecked(questDataArray.push(name));
    unchecked(questDataArray.push(description));
    unchecked(questDataArray.push(maxProgress));
    unchecked(questDataArray.push(progress));
    unchecked(questDataArray.push(visible));
    return p++;
  },
  _indexOfProp(of: keyof Quest) {
    for (let i = 0, m = Quest.keys.size; i < m; i++) {
      if (unchecked(Quest.keys[i]) == of) return i;
    }
  },
  set<T>(ptr: number, of: keyof Quest, setValue: T) {
    unchecked((questDataArray[ptr * Quest.keys.size + Quest._indexOfProp(of)] = setValue));
  },
  get<T>(ptr: number, of: keyof Quest): T {
    return unchecked(questDataArray[ptr * Quest.keys.size + Quest._indexOfProp(of)]) as T;
  },
};
// this is very awful
const AMOUNT_OF_INSTANCE = 3;
const questDataArray = new DynamicArray(AMOUNT_OF_INSTANCE * Quest.keys.size);

function setup() {
  Quest.create({
    name: "국토수복: 경상도",
    description: "반격할 기반이 될 지역이 필요합니다.",
    maxProgress: 5,
  });

  Quest.create({
    name: "국토수복: 전라도",
    description: "더 많은 자원과 추가 렌드리스가 필요합니다.",
    maxProgress: 3,
  });

  Quest.create({
    name: "국토수복: 북상",
    description: "우리의 수도를, 마지막 렌드리스를 향하여.",
    maxProgress: 8,
  });
}

function update() {
  const isQuestProcessorStart = getFlag("start-quest-processor");
  if (isQuestProcessorStart) {
    setFlag("start-quest-processor", false);
    Quest.set(0, "visible", true);
  }

  for (let i = 0, f = false; i < AMOUNT_OF_INSTANCE; i++) {
    const visible = Quest.get(i, "visible");
    if (!visible) continue;
    resolveCallback(i);
    const name = Quest.get(i, "name");
    const progress = Quest.get(i, "progress");
    const maxProgress = Quest.get(i, "maxProgress");
    const description = Quest.get(i, "description");

    if (!f) f = true;
    else if (!(i + 1 >= AMOUNT_OF_INSTANCE)) {
      print("\n\n");
    }
    print`[accent]${name}[](${progress}/${maxProgress})
  ${description}`;
  }
  flushMessage.mission();
  printFlush();
}

const 경상도_코어 = new MutableArray([603.5, 354.5, 637.5, 356.5, 598.5, 398.5, 611.5, 447.5, 648.5, 378.5]);
const 전라도_코어 = new MutableArray([464, 342, 477.5, 351.5, 508.5, 397.5]);
const 북상_코어 = new MutableArray([
  495, 517, 475.5, 508.5, 519.5, 430.5, 511, 447, 494.5, 495.5, 527.5, 459.5, 544.5, 539.5, 470.5, 447.5,
]);
function resolveCallback(questPtr: number) {
  switch (questPtr) {
    case 0: {
      let count = 0;
      for (let i = 0; i < 경상도_코어.size; i += 2) {
        const x = 경상도_코어[i];
        const y = 경상도_코어[i + 1];

        if (getBlock.building(x, y).team == 1) {
          count++;
        }
      }
      const maxProgress = Quest.get<number>(questPtr, "maxProgress");
      Quest.set(questPtr, "progress", count);
      if (count >= maxProgress) {
        Quest.set(questPtr, "visible", false);
        Quest.set(questPtr + 1, "visible", true);
      }
      break;
    }
    case 1: {
      let count = 0;
      for (let i = 0; i < 전라도_코어.size; i += 2) {
        const x = 전라도_코어[i];
        const y = 전라도_코어[i + 1];

        if (getBlock.building(x, y).team == 1) {
          count++;
        }
      }
      const maxProgress = Quest.get<number>(questPtr, "maxProgress");
      Quest.set(questPtr, "progress", count);
      if (count >= maxProgress) {
        Quest.set(questPtr, "visible", false);
        Quest.set(questPtr + 1, "visible", true);
      }
      break;
    }
    case 2: {
      let count = 0;
      for (let i = 0; i < 북상_코어.size; i += 2) {
        const x = 북상_코어[i];
        const y = 북상_코어[i + 1];

        if (getBlock.building(x, y).team == 1) {
          count++;
        }
      }
      const maxProgress = Quest.get<number>(questPtr, "maxProgress");
      Quest.set(questPtr, "progress", count);
      if (count >= maxProgress) {
        Quest.set(questPtr, "visible", false);
      }
      break;
    }
  }
}

setRate(500);
setup();
while (true) {
  update();
}
