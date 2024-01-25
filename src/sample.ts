import type { PartPartial } from "./@types/utils.ts";

interface StructProps {
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  visible: boolean;
}
let p = 0;
const Struct = {
  keys: new MutableArray(["name", "description", "maxProgress", "progress", "visible"]),
  create({
    name,
    description,
    maxProgress,
    progress = 0,
    visible = false,
  }: PartPartial<StructProps, "progress" | "visible">) {
    unchecked(structDataArray.push(name));
    unchecked(structDataArray.push(description));
    unchecked(structDataArray.push(maxProgress));
    unchecked(structDataArray.push(progress));
    unchecked(structDataArray.push(visible));
    return p++;
  },
  _indexOfProp(of: keyof StructProps) {
    for (let i = 0, m = Struct.keys.size; i < m; i++) {
      if (unchecked(Struct.keys[i]) == of) return i;
    }
  },
  set<T>(ptr: number, of: keyof StructProps, setValue: T) {
    unchecked((structDataArray[ptr * Struct.keys.size + Struct._indexOfProp(of)] = setValue));
  },
  get<T>(ptr: number, of: keyof StructProps): T {
    return unchecked(structDataArray[ptr * Struct.keys.size + Struct._indexOfProp(of)]) as T;
  },
};
// this is very awful
const AMOUNT_OF_INSTANCE = 1;
const structDataArray = new DynamicArray(AMOUNT_OF_INSTANCE * Struct.keys.size);

const struct1Ptr = Struct.create({
  name: "hello world",
  description: "this is description",
  maxProgress: 3,
});
while (true) {
  print`pointer: ${struct1Ptr}\n`;
  print`name: ${Struct.get(struct1Ptr, "name")}\n`;
  print`description: ${Struct.get(struct1Ptr, "description")}\n`;
  print`progress: ${Struct.get(struct1Ptr, "progress")}`;
  printFlush(getBuilding("message1"));

  Struct.set(struct1Ptr, "progress", Vars.time);
}
