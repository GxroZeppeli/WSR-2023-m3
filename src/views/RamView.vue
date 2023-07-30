<script setup>
import ItemList from '../components/ItemList.vue';

  const emit = defineEmits(['error'])
</script>

<template>
  <div class="container py-3">
    <div class="row">
      <div class="col">
        <ItemList page="ram-memories" @error="e => emit('error', e)"></ItemList>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
