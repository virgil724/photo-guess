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
            <Label for="name">Google Sheet URL</Label>
            <Input id="name" v-model="url" placeholder="Sheet URL" />
            <FormField v-slot="{ componentField, value }" name="duration">
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
const showAnswer = ref(false);

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
