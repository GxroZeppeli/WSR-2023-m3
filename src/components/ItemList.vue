<script setup>
import { watchEffect } from 'vue';
import { ref } from 'vue';

  const emit = defineEmits(['error']);
  const props = defineProps(['page', 'editor']);
  const items = ref();
  const url = 'http://alatech/api/';

  const loadItems = async () => {
    try {
      const responce = await fetch(url + props.page, { headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }});
      const data = await responce.json();
      if(responce.ok) {
        items.value = data;
      } else emit('error', data.message);
    } catch (err) {
      emit('error', err.message);
    }
  };
  loadItems();
  watchEffect(() => {loadItems()});
</script>

<template>
  <div class="row row-cols-lg-3 row-cols-md-2 row-cols-1 align-items-stretch pt-3" v-if="!editor">
    <div class="col" v-for="item in items">
      <div class="card w-100 h-100">
        <img :src="url + 'images/' + item.imageUrl" class="card-img-top">
        <div class="card-body">{{ item.name }}</div>
      </div>
    </div>
  </div>
  <div class="row row-cols-2 align-items-stretch g-2" v-else>
    <div class="col" v-for="item in items">
      <div class="card w-100 h-100" draggable="true" :data-img="url + 'images/' + item.imageUrl" :data-id="item.id" :data-name="item.name" :data-section="page">
        <img :src="url + 'images/' + item.imageUrl" class="card-img-top">
        <div class="card-body">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>