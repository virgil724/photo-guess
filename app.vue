<template>
  <div class="h-full grid justify-center content-center gap-2">
    <Card v-if="!sheetId" class="w-[350px]">
      <CardHeader>
        <CardTitle>抽 抽</CardTitle>
        <CardDescription>痾 就巴你的google表單下來骰</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
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
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button @click="updateSheetId">抽</Button>
      </CardFooter>
    </Card>

    <div class="flex flex-row gap-12" v-else>
      <Card class="w-[200px]" v-if="showAnswer">
        <div class="flex flex-row">
          <Card class="w-full m-4">
            <CardHeader>
              <CardTitle> Score </CardTitle>
            </CardHeader>
            <CardDescription></CardDescription>
            <CardContent class="grid gap-4">
              <div class="flex items-center space-x-4 rounded-md border p-4">
                <div class="flex-1 space-y-1">
                  <p class="text-xl font-medium text-green-600 text-center">
                    {{ score }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
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
  let cnt = 0;
  guessedPeople.value.forEach((e) => {
    if (e.ans === true) {
      cnt += 1;
    }
  });
  return ` ${cnt}/${guessedPeople.value.length}`;
});
const updateSheetId = () => {
  console.log("click");
  const re = RegExp("https:\/\/docs.google.com\/spreadsheets\/d\/(.+)\/.+");
  if (re.test(url.value)) {
    console.log("success");
    sheetId.value = url.value.match(re)[1];
  } else sheetId.value = "";
};
</script>
