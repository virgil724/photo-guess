<template>
  <Card class="w-full max-w-2xl">
    <CardContent class="pt-4">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="animate-pulse space-y-4 p-4">
        <div class="bg-muted rounded-lg h-[400px] w-full" />
        <div class="space-y-2 mt-4">
          <div class="bg-muted rounded h-10 w-full" />
          <div class="bg-muted rounded h-10 w-full" />
          <div class="bg-muted rounded h-10 w-full" />
        </div>
      </div>

      <!-- Game Carousel -->
      <Carousel v-else class="w-full" @init-api="setApi">
        <!-- Countdown timer bar (timed mode only) -->
        <div v-if="timerSeconds" class="flex items-center gap-2 mb-2">
          <span class="text-sm tabular-nums text-muted-foreground">⏱ {{ countdown }}s</span>
          <div class="flex-1 bg-muted rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all duration-1000"
              :class="countdown <= 5 ? 'bg-destructive' : 'bg-primary'"
              :style="{ width: `${(countdown / timerSeconds) * 100}%` }"
            />
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="rows.length > 0" class="mb-3 px-1">
          <div class="flex justify-between text-xs text-muted-foreground mb-1">
            <span>第 {{ (current ?? 0) + 1 }} 題</span>
            <span>共 {{ rows.length }} 題</span>
          </div>
          <div class="w-full bg-muted rounded-full h-1.5">
            <div
              class="bg-primary h-1.5 rounded-full transition-all duration-300"
              :style="{ width: `${(((current ?? 0) + 1) / rows.length) * 100}%` }"
            />
          </div>
        </div>

        <CarouselContent>
          <CarouselItem v-for="(item, index) in rows" :key="index">
            <Card class="m-2">
              <CardContent class="flex justify-center p-4">
                <LargerPic :picUrl="`https://image.virgil246.eu.org/?url=${item.imgUrl}`" v-if="!item.error">
                  <div class="relative group cursor-zoom-in max-h-[60vh] overflow-y-auto">
                    <img
                      class="mt-2 w-full object-contain"
                      @error="errorLoadImg(index)"
                      :src="`https://image.virgil246.eu.org/?url=${item.imgUrl}`"
                    />
                    <span class="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      點擊放大
                    </span>
                  </div>
                </LargerPic>
                <Button v-else class="mt-4" @click="retryLoadImg(index)">Retry</Button>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />

        <!-- Answer Buttons -->
        <div class="grid gap-2 mt-3" v-if="rows.length > 0 && current != null">
          <Button
            v-for="item in rows[current].options"
            :key="item.opt + current"
            :disabled="rows[current].guessed"
            class="w-full transition-all duration-150"
            :class="{
              'bg-green-600 hover:bg-green-700 text-white': rows[current].name === item.opt && showAnswer,
              'bg-red-600 hover:bg-red-700 text-white': rows[current].name !== item.opt && showAnswer && rows[current].click === item,
              'opacity-50 cursor-not-allowed': rows[current].guessed && rows[current].click !== item && !(rows[current].name === item.opt && showAnswer),
              'hover:scale-[1.01]': !rows[current].guessed,
            }"
            @click="onClickAns(current, item)"
          >
            {{ item.opt }}
          </Button>
          <Button variant="outline" class="w-full mt-1" @click="$emit('show-answer')">答案和分數</Button>
        </div>
      </Carousel>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { CarouselApi } from "./components/ui/carousel";

const rows = ref([]);
const loading = ref(true);
const emit = defineEmits(["guess-add", "show-answer"]);
const { sheetId, choicesNum, showAnswer, timerSeconds, maxQuestions } = defineProps([
  "sheetId",
  "choicesNum",
  "showAnswer",
  "timerSeconds",
  "maxQuestions",
]);

// Countdown timer
const countdown = ref(timerSeconds ?? 0);

const advance = () => {
  countdown.value = timerSeconds;
  api.value?.scrollNext();
};

const { resume } = useIntervalFn(() => {
  countdown.value--;
  if (countdown.value <= 0) advance();
}, 1000, { immediate: false });

const onClickAns = (ans, click) => {
  if (rows.value[ans].guessed === false) {
    rows.value[ans].guessed = true;
    rows.value[ans].click = click;
    emit("guess-add", click);
  }
};

const rowsLen = computed(() => rows.value.length);

function getNumbersFromRangeWithSpecific(min, max, numOfChoices, specificNumber) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const remainingNumbers = numbers.filter((num) => num !== specificNumber);
  const randomChoices = [];
  for (let i = 0; i < numOfChoices; i++) {
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    randomChoices.push(remainingNumbers[randomIndex]);
    remainingNumbers.splice(randomIndex, 1);
  }
  randomChoices.push(specificNumber);
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
      const item = array[index];
      if (item !== undefined) {
        result.push({ opt: item.name, ans: i === index });
      }
    });
    array[i].options = result;
  }
};

const errorLoadImg = (index) => { rows.value[index].error = true; };
const retryLoadImg = (index) => { rows.value[index].error = false; };

const api = ref<CarouselApi>();
function setApi(val: CarouselApi) { api.value = val; }

const current = ref<number | undefined>(undefined);
watchOnce(api, (api) => {
  if (!api) return;
  current.value = api.selectedScrollSnap();
  api.on("select", () => {
    current.value = api.selectedScrollSnap();
    if (timerSeconds) countdown.value = timerSeconds;
  });
});

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
  if (maxQuestions) rows.value = rows.value.slice(0, maxQuestions);
  addOptions(rows.value);
  loading.value = false;
  if (timerSeconds) resume();
});
</script>
