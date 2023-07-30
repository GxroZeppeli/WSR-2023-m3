<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

  const auth = ref(localStorage.getItem('token'));
  const error = ref('');
  const url = 'http://alatech/api/';
  const login = ref('');
  const password = ref('');

  const tryLogin = async () => {
    const body = {username: login.value, password: password.value};
    try {
      const responce = await fetch(url + 'login', { headers: {
        'Content-type': 'application/json'
      }, body: JSON.stringify(body), method: 'POST'});
      const data = await responce.json();
      if(responce.ok) {
        auth.value = data.token;
        localStorage.setItem('token', data.token);
      } else error.value = data.message;
    } catch (err) {
      error.value = err.message;
    }
  };
  const tryLogout = async () => {
    try {
      const responce = await fetch(url + 'logout', { headers: {
        'Authorization': 'Bearer ' + auth.value
      }, method: 'DELETE'});
      const data = await responce.json();
      if(responce.ok) {
        auth.value = '';
        localStorage.removeItem('token');
      } else error.value = data.message;
    } catch (err) {
      error.value = err.message;
    }
  };
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-xl bg-dark">
      <div class="container-fluid">
        <RouterLink class="navbar-brand text-light" :to="{name: 'home'}">Alatech</RouterLink>
        <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-xl-0">
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'home'}">Машины</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'mb'}">Материнские платы</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'cpu'}">Процессоры</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'ram'}">Оперативная память</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'storage'}">Устройства хранения</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'gpu'}">Видеокарты</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link text-light" :to="{name: 'psu'}">Блоки питания</RouterLink>
            </li>
          </ul>
          <button @click="tryLogout" class="btn btn-light" v-if="auth">Выход</button>
        </div>
      </div>
    </nav>
  </header>
  <main>
    <RouterView v-if="auth" @error="e => error = e"></RouterView> 
    <div class="container d-flex justify-content-center align-items-center">

      <div class="card" v-if="!auth">
        <div class="card-header bg-dark text-light d-flex justify-content-center">
          <h5 class="d-inline">Форма входа</h5>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="login" class="form-label">Логин</label>
            <input type="text" class="form-control" id="login" v-model="login">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Пароль</label>
            <input type="password" class="form-control" id="password" v-model="password">
          </div>
          <button @click="tryLogin" class="btn btn-dark w-100">Войти</button>
        </div>
      </div>

      <div v-if="error" @click="() => error=null" class="error-bg d-flex justify-content-center align-items-center">
        <div class="card">
          <div class="card-header bg-dark text-light d-flex justify-content-center">
            <h5 class="d-inline">Ошибка</h5>
          </div>
          <div class="card-body text-center">{{ error }}</div>
          <div class="card-footer">
            <button @click="() => error=null" class="btn btn-dark w-100">Ок</button>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
  main {
    min-height: calc(100vh - 56px);
  }
  .error-bg {
    background: #00000031;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
  }
  .error-bg .card {
    max-width: 250px;
  }
</style>
