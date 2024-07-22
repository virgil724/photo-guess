<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot>
        <Button variant="outline"> Show Dialog </Button>
      </slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <div class="img-container">
          <VueMagnifier :src="props.picUrl" />
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>關閉 </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
const props = defineProps(["picUrl"]);
import VueMagnifier from "@websitebeaver/vue-magnifier";
import "@websitebeaver/vue-magnifier/styles.css";
</script>

<style>
.img-container {

  height: 600px;
  overflow-y: scroll;

}
</style>
