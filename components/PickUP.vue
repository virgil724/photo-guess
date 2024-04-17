<template>
  <Card>
    <CardContent>
      <Carousel class="max-w-xs" @init-api="setApi">
        <CarouselContent>
          <CarouselItem v-for="(item, index) in rows" :key="index">
            <Card class="m-4">
              <LargerPic
                :picUrl="`https://image.virgil246.eu.org/?url=${item.imgUrl}`"
              >
                <CardContent class="flex justify-center">
                  <img
                    @click=""
                    v-if="!item.error"
                    class="mt-5"
                    @error="errorLoadImg(index)"
                    :src="`https://image.virgil246.eu.org/?url=${item.imgUrl}`"
                  />

                  <Button v-else class="mt-4" @click="retryLoadImg(index)"
                    >Retry</Button
                  >
                </CardContent>
              </LargerPic>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div class="grid gap-2">
          <Button
            v-if="rows.length > 0"
            class="px-15"
            v-for="item in getNumbersFromRangeWithSpecific(
              0,
              rowsLen - 1,
              choicesNum - 1,
              current
            )"
            @click="onClickAns($event, current, item)"
            :key="item + Math.random()"
            >{{ rows[item].name }}</Button
          >
        </div>
      </Carousel>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { CarouselApi } from "./components/ui/carousel";

const rows = ref({});
const emit = defineEmits(["guess-add"]);
const onClickAns = (event, ans, click) => {
  const targetElement = event.currentTarget;
  if (ans === click) {
    if (rows.value[ans].guessed === false) {
      rows.value[ans].guessed = true;
      emit("guess-add", { name: rows.value[ans].name });
    }
    targetElement.style.backgroundColor = "#16a34a";
  } else {
    targetElement.style.backgroundColor = "#dc2626";
  }
  console.log(e);
};
const rowsLen = computed(() => rows.value.length);
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getNumbersFromRangeWithSpecific(
  min,
  max,
  numOfChoices,
  specificNumber
) {
  // Create an array with all numbers in the range
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  // Remove the specificNumber from the array if it's in the range
  const remainingNumbers = numbers.filter((num) => num !== specificNumber);

  // Get random choices from the remaining numbers
  const randomChoices = [];
  for (let i = 0; i < numOfChoices; i++) {
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const randomNumber = remainingNumbers[randomIndex];
    randomChoices.push(randomNumber);
    remainingNumbers.splice(randomIndex, 1);
  }

  // Add the specificNumber to the randomChoices array
  randomChoices.push(specificNumber);

  // Shuffle the array and return
  return randomChoices.sort(() => Math.random() - 0.5);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
const addOptions = (array) => {
  for (let i = 0; i < array.length; i++) {
    const choicesInd = getNumbersFromRangeWithSpecific(
      0,
      rowsLen.value - 1,
      choicesNum[0] - 1,
      i
    );
    const result = [];
    choicesInd.forEach((index) => {
      const item = array[index]; // Subtract 1 since array indices start from 0
      if (item !== undefined) {
        let ele = { opt: item.name, ans: false };
        if (i == index) {
          ele.ans = true;
        }
        result.push(ele);
      }
    });

    array[i].options = result;
  }
};

const errorLoadImg = (index) => {
  rows.value[index].error = true;
};
const retryLoadImg = (index) => {
  rows.value[index].error = false;
};
const api = ref<CarouselApi>();

function setApi(val: CarouselApi) {
  console.log(val);
  api.value = val;
}
const current = ref();
watchOnce(api, (api) => {
  if (!api) return;

  current.value = api.selectedScrollSnap();

  api.on("select", () => {
    current.value = api.selectedScrollSnap();
  });
});
const { sheetId } = defineProps(["sheetId", "choicesNum"]);
onMounted(async () => {
  const doc = new GoogleSpreadsheet(sheetId, {
    apiKey: "AIzaSyBnQiojmGBSD3IjmZxRaYsSQR_DjwdpJGg",
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  rows.value = (await sheet.getRows()).map((e) => {
    const searchParams = new URL(e._rawData[1]).searchParams;
    const googleImgID = searchParams.get("id");
    return {
      name: e._rawData[3],
      imgUrl: `https://drive.google.com/uc?id=${googleImgID}`,
      error: false,
      guessed: false,
    };
  });
  shuffle(rows.value);
  addOptions(rows.value);
});
</script>

<style></style>
