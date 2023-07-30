<script setup>
import ItemList from '../components/ItemList.vue';

  const emit = defineEmits(['error'])
</script>

<template>
  <div class="container py-3">
    <div class="row">
      <div class="col">
        <RouterLink :to="{name: 'editor'}" class="btn btn-dark">Создать новую сборку</RouterLink>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ItemList page="machines" @error="e => emit('error', e)"></ItemList>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
