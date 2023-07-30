<script setup>
import { ref } from 'vue';
import ItemList from '../components/ItemList.vue';
import { useRouter } from 'vue-router';

  const emit = defineEmits(['error']);
  const curSelection = ref('motherboards');
  const dragged = ref();
  const url = 'http://alatech/api/';
  const router = useRouter();
  const machine = {
    motherboardId: '',
    powerSupplyId: '',
    processorId: '',
    ramMemoryId: '',
    ramMemoryAmount: 1,
    storageDevices: [],
    graphicCardId: '',
    graphicCardAmount: 1,
    'name': '',
    description: '',
    imageBase64: ''
  };

  const validate = async part => {
    try {
        const responce = await fetch(url + 'verify-compatibility', { headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }, body: JSON.stringify(machine), method: 'POST'});
        if(!responce.ok) {
          part.classList.add('invalid');
        }
      } catch (err) {
        emit('error', err.message);
      }
  };
  
  const handleDrop = e => {
    const dropZone = e.target;
    const dropSet = dropZone.dataset;
    const dragSet = dragged.value.dataset; 
    if(dropSet.section == dragSet.section) {
      if(machine.motherboardId && machine.powerSupplyId) {
        if(dragSet.section == 'processors') machine.processorId = dragSet.id;
        if(dragSet.section == 'ram-memories') machine.ramMemoryId = dragSet.id;
        if(dragSet.section == 'graphic-cards') machine.graphicCardId = dragSet.id;
        if(dragSet.section == 'storage-devices') machine.storageDevices.push({storageDeviceId: dragSet.id, amount: 1});
        dropZone.innerHTML = dragSet.name;
        dropZone.parentNode.childNodes[2].setAttribute('src', dragSet.img);
        validate(dropZone.parentNode);
      } else {
        if(dragSet.section == 'motherboards') {
          machine.motherboardId = dragSet.id;
          dropZone.innerHTML = dragSet.name;
          dropZone.parentNode.childNodes[2].setAttribute('src', dragSet.img);
        } else if(dragSet.section == 'power-supplies') {
          machine.powerSupplyId = dragSet.id;
          dropZone.innerHTML = dragSet.name;
          dropZone.parentNode.childNodes[2].setAttribute('src', dragSet.img);
        }
      }
    }
  };

  const showRemove = e => {
    e.target.parentNode.childNodes[3].classList.remove('visually-hidden');
  };

  const hideRemove = e => {
    e.target.childNodes[3].classList.add('visually-hidden');
  };

  const removePart = e => {
    const card = e.target.parentNode;
    card.classList.remove('invalid');
    card.childNodes[1].innerHTML = 'Перетащите компонент из списка';
    card.childNodes[2].setAttribute('src', '');
    card.childNodes[3].classList.add('visually-hidden');
    const section = card.childNodes[1].dataset.section;
    if(section == 'processors') machine.processorId = '';
    if(section == 'ram-memories') machine.ramMemoryId = '';
    if(section == 'graphic-cards') machine.graphicCardId = '';
    if(section == 'storage-devices') machine.storageDevices.pop();
    if(section == 'motherboards') machine.motherboardId = '';
    if(section == 'power-supplies') machine.powerSupplyId = '';
  };

  const changeAmount = (e, field) => {
    if(e.target.value < 1) e.target.value = 1;
    machine[field] = e.target.value;
  };

  const toBase64 = async img => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const loadFile = async e => {
    const file = e.target.files[0];
    const base64 = await toBase64(file);
    machine.imageBase64 = base64;
  };

  const saveMachine = async () => {
    if(machine.description && machine.graphicCardId && machine.imageBase64 && machine.ramMemoryId && machine.motherboardId && machine.name && machine.powerSupplyId && machine.processorId && machine.storageDevices[0].storageDeviceId) {
      try {
        const responce = await fetch(url + 'machines', { headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }, body: JSON.stringify(machine), method: 'POST'});
        const data = await responce.json();
        if(responce.ok) router.replace({name: 'home'});
        else emit('error', data);
      } catch (err) {
        emit('error', err.message);
      }
    } else {
      emit('error', 'Для сохранения должны быть выбраны все компоненты и изображение, введены название и описание.');
    }
  };

  const changeName = e => {
    machine.name = e.target.value;
  };

  const changeDescription = e => {
    machine.description = e.target.value;
  };
</script>

<template>
  <div class="container py-3">
    <div class="row">
      <div class="col">
        <h2>Создание новой сборки</h2>
      </div>
      <div class="col d-flex justify-content-end align-items-center">
        <button class="btn btn-dark" @click="saveMachine">Сохранить</button>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col col-lg-4 col-12">

        <select class="form-select mb-4" @change="e => curSelection = e.target.value">
          <option value="motherboards" selected>Материнские платы</option>
          <option value="processors">Процессоры</option>
          <option value="ram-memories">Оперативная память</option>
          <option value="storage-devices">Устройства хранения</option>
          <option value="graphic-cards">Видеокарты</option>
          <option value="power-supplies">Блоки питания</option>
        </select>
        <ItemList class="items mb-3" :page="curSelection" editor="true" @dragstart="e => dragged = e.target"></ItemList>
        <div class="card mb-3">
          <div class="card-body">
            Материнская плата и блок питания должны быть добавлены до остальных компонентов.
          </div>
        </div>

      </div>
      <div class="col col-lg-8 col-12">
        <div class="row row-cols-lg-3 row-cols-1 g-3">

          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">Материнская плата</div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="motherboards">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>
          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">Процессор</div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="processors">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>

          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">
                <span class="d-block">Оперативная память</span>
                <div class="d-flex align-items-center justify-content-center">
                  <span>Количество</span>
                  <input type="number" class="form-control ms-2" value="1" @change="e => changeAmount(e, 'memoryAmount')">
                </div>
              </div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="ram-memories">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>
          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">
                <span class="d-block">Видеокарта</span>
                <div class="d-flex align-items-center justify-content-center">
                  <span>Количество</span>
                  <input type="number" class="form-control ms-2" value="1" @change="e => changeAmount(e, 'graphicCardAmount')">
                </div>
              </div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="graphic-cards">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>

          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">Блок питания</div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="power-supplies">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>
          <div class="col">
            <div class="card part w-100" @pointerleave="e => hideRemove(e)">
              <div class="card-header text-center">Устройство хранения</div>
              <div class="card-body text-center" @dragover.prevent="" @drop.prevent="e => handleDrop(e)" data-section="storage-devices">Перетащите компонент из списка</div>
              <img src="" class="card-img-bottom" @pointerover="e => showRemove(e)">
              <button class="btn btn-dark w-100 remove visually-hidden" @click="e => removePart(e)">Удалить</button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="row">

      <div class="col">
        <div class="mb-3">
          <label for="name" class="form-label">Название машины</label>
          <input type="text" class="form-control" id="name" @change="e => changeName(e)">
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Описание</label>
          <textarea class="form-control" id="description" rows="3" @change="e => changeDescription(e)"></textarea>
        </div>
      </div>
      <div class="mb-3">
        <label for="formFile" class="form-label">Изображение сборки</label>
        <input class="form-control" type="file" id="formFile" @change="e => loadFile(e)">
      </div>

    </div>
  </div>
</template>

<style scoped>
  .items {
    max-height: 300px;
    overflow-y: auto;
  }
  .part {
    height: 300px;
  }
  .remove {
    position: absolute;
    bottom: 5px;
    opacity: 0.9;
  }
  .card-img-bottom {
    max-height: 160px;
    max-width: 160px;
    align-self: center;
  }
  .invalid {
    opacity: 0.6;
  }
</style>