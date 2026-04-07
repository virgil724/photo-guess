<template>
  <div class="min-h-screen flex justify-center items-start md:items-center p-6">
    <!-- Setup Card -->
    <Card v-if="!sheetId" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>抽 抽</CardTitle>
        <CardDescription>痾 就巴你的google表單下來骰</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="url">Google Sheet URL</Label>
            <Input id="url" v-model="url" placeholder="Sheet URL" />

            <!-- Mode Toggle -->
            <div class="flex flex-col space-y-1.5 pt-1">
              <Label>模式</Label>
              <div class="flex gap-2">
                <Button
                  :variant="mode === 'normal' ? 'default' : 'outline'"
                  class="flex-1"
                  @click="mode = 'normal'"
                >一般</Button>
                <Button
                  :variant="mode === 'timed' ? 'default' : 'outline'"
                  class="flex-1"
                  @click="mode = 'timed'"
                >限時作答</Button>
              </div>
            </div>

            <!-- 選項數量 (both modes) -->
            <FormField v-slot="{ componentField, value }" name="choices">
              <FormItem>
                <FormLabel>選項數量</FormLabel>
                <FormControl>
                  <Slider
                    v-bind="componentField"
                    v-model="choicesNum"
                    :default-value="[3]"
                    :max="10"
                    :min="3"
                  />
                  <FormDescription class="flex justify-between">
                    <span>希望答案有幾個選項</span>
                    <span>{{ value?.[0] }} 個</span>
                  </FormDescription>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- 題數 (timed mode only) -->
            <FormField v-if="mode === 'timed'" v-slot="{ componentField, value }" name="count">
              <FormItem>
                <FormLabel>題數</FormLabel>
                <FormControl>
                  <Slider
                    v-bind="componentField"
                    v-model="questionCount"
                    :default-value="[20]"
                    :max="40"
                    :min="5"
                  />
                  <FormDescription class="flex justify-between">
                    <span>抽幾題</span>
                    <span>{{ value?.[0] }} 題</span>
                  </FormDescription>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button @click="updateSheetId">抽</Button>
      </CardFooter>
    </Card>

    <!-- Game View -->
    <div class="flex flex-col md:flex-row gap-6 items-start w-full max-w-4xl" v-else>
      <!-- Score Card (always visible) -->
      <Card class="w-full md:w-[160px] shrink-0">
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-center rounded-md border p-4">
            <p class="text-3xl font-bold" :class="showAnswer ? 'text-primary' : 'text-muted-foreground'">
              {{ showAnswer ? score : '?' }}
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Main Game -->
      <PickUP
        :sheetId="sheetId"
        @guess-add="guessAdd"
        :choicesNum
        @show-answer="showAnswer = !showAnswer"
        :showAnswer
        :timerSeconds="mode === 'timed' ? 30 : undefined"
        :maxQuestions="mode === 'timed' ? questionCount[0] : undefined"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CardDescription from "./components/ui/card/CardDescription.vue";

const url = ref("");
const sheetId = ref("");
const guessedPeople = ref([]);
const choicesNum = ref([3]);
const questionCount = ref([20]);
const showAnswer = ref(false);
const mode = ref<'normal' | 'timed'>('normal');

const guessAdd = (item) => {
  guessedPeople.value.push(item);
};

const score = computed(() => {
  const cnt = guessedPeople.value.filter((e) => e.ans === true).length;
  return `${cnt}/${guessedPeople.value.length}`;
});

const updateSheetId = () => {
  const re = RegExp("https:\/\/docs.google.com\/spreadsheets\/d\/(.+)\/.+");
  if (re.test(url.value)) {
    sheetId.value = url.value.match(re)[1];
  } else sheetId.value = "";
};
</script>
