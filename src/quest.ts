import { flushMessage } from "mlogjs:world";

const questDatasetArray = new DynamicArray(20);
function setupQuest({ name, description, conditionId }: { name: string; description: string; conditionId: number }) {
  questDatasetArray.push(name);
  questDatasetArray.push(conditionId);
}

function loopQuest(i: number) {
  const name = questDatasetArray[i];
  const conditionId = questDatasetArray[i + 1];

  print`[accent]퀘스트[]: ${name}`;
  flushMessage.mission();
  printFlush();
}

setupQuest({
  name: "국토수복",
  description: "경상도 일대를 모두 되찾으세요.",
  conditionId: 0,
});

while (true) {
  for (let i = 0; i < questDatasetArray.length; i += 2) {
    loopQuest(i);
  }
}
