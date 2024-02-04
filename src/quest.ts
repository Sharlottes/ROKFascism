import { flushMessage, getBlock, getFlag, localePrint, setFlag, setRate } from "mlogjs:world";
import type { PartPartial } from "./@types/utils.ts";

const 영남_코어 = new MutableArray([603.5, 354.5, 637.5, 356.5, 598.5, 398.5, 611.5, 447.5, 648.5, 378.5]);
const 호남_코어 = new MutableArray([464, 342, 477.5, 351.5, 508.5, 397.5]);
const 북상_코어 = new MutableArray([
  495, 517, 475.5, 508.5, 519.5, 430.5, 511, 447, 494.5, 495.5, 527.5, 459.5, 544.5, 539.5, 470.5, 447.5,
]);

interface Quest {
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  visible: boolean;
  children: number;
  childrenAmount: number;
}
let p = 0;
const Quest = {
  propNames: new MutableArray([
    "name",
    "description",
    "maxProgress",
    "progress",
    "visible",
    "children",
    "childrenAmount",
  ]),
  create({
    name,
    description,
    maxProgress,
    progress = 0,
    visible = false,
    children = 0,
    childrenAmount = 1,
  }: PartPartial<Quest, "progress" | "visible" | "children" | "childrenAmount">) {
    unchecked(questDataArray.push(name));
    unchecked(questDataArray.push(description));
    unchecked(questDataArray.push(maxProgress));
    unchecked(questDataArray.push(progress));
    unchecked(questDataArray.push(visible));
    unchecked(questDataArray.push(children));
    unchecked(questDataArray.push(childrenAmount));
    return p++;
  },
  _indexOfProp(of: keyof Quest) {
    for (let i = 0, m = Quest.propNames.size; i < m; i++) {
      if (unchecked(Quest.propNames[i]) == of) return i;
    }
  },
  set<K extends keyof Quest>(ptr: number, of: K, setValue: Quest[K]) {
    unchecked((questDataArray[ptr * Quest.propNames.size + Quest._indexOfProp(of)] = setValue as Quest[K]));
  },
  get<K extends keyof Quest>(ptr: number, of: K): Quest[K] {
    return unchecked(questDataArray[ptr * Quest.propNames.size + Quest._indexOfProp(of)]) as Quest[K];
  },

  updateQuest(questPtr: number) {
    switch (questPtr) {
      case 0: {
        let count = 0;
        for (let i = 0; i < 영남_코어.size; i += 2) {
          const x = 영남_코어[i];
          const y = 영남_코어[i + 1];

          if (getBlock.building(x, y).team == 1) {
            count++;
          }
        }
        Quest.set(questPtr, "progress", count);
        break;
      }
      case 1: {
        let count = 0;
        for (let i = 0; i < 호남_코어.size; i += 2) {
          const x = 호남_코어[i];
          const y = 호남_코어[i + 1];

          if (getBlock.building(x, y).team == 1) {
            count++;
          }
        }
        Quest.set(questPtr, "progress", count);
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
        Quest.set(questPtr, "progress", count);
        break;
      }
    }
  },
  onQuestDone(questPtr: number) {
    const childrenAmount = Quest.get(questPtr, "childrenAmount");
    let packed = Quest.get(questPtr, "children");
    Quest.set(questPtr, "visible", false);

    const mask = 2 ** 8 - 1;
    for (let i = 0; i < childrenAmount; i++) {
      const childQuestPtr = packed & mask;
      Quest.set(childQuestPtr, "visible", true);
      packed >>= 8;
    }
  },
};
// this is very awful
const AMOUNT_OF_INSTANCE = 3;
const questDataArray = new DynamicArray(AMOUNT_OF_INSTANCE * Quest.propNames.size);

function setup() {
  Quest.create({
    name: "quest.restoration.yeongnam.title",
    description: "quest.restoration.yeongnam.description",
    maxProgress: 5,
    children: 1,
  });

  Quest.create({
    name: "quest.restoration.honam.title",
    description: "quest.restoration.honam.description",
    maxProgress: 3,
    children: 2,
  });

  Quest.create({
    name: "quest.restoration.tothenorth.title",
    description: "quest.restoration.tothenorth.description",
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
    Quest.updateQuest(i);

    const progress = Quest.get(i, "progress");
    const maxProgress = Quest.get(i, "maxProgress");
    if (progress >= maxProgress) {
      Quest.onQuestDone(i);
    }

    const name = Quest.get(i, "name");
    const description = Quest.get(i, "description");

    if (!f) f = true;
    else if (!(i + 1 >= AMOUNT_OF_INSTANCE)) {
      print("\n\n");
    }
    print("[accent]");
    localePrint(name);
    print`[](${progress}/${maxProgress})\n`;
    localePrint(description);
    print("\n");
    localePrint("quest.reward");
    print(": ");
  }
  flushMessage.mission();
  printFlush();
}

setRate(500);
setup();
while (true) {
  update();
}
