<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Accueil</router-link> |
      <router-link to="/account">Mon Compte</router-link> |
      <router-link to="/forum">Forum</router-link>
    </div>
    <router-view/>
  </div>
</template>






<style>
* {
  background: #40bbea;
}

html {
  height: 100%;
}
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

button, input, textarea {
  background: #d14454;
  color: #fff;
}

button {
  padding: 5px;
  cursor: pointer;
}

#app {
  font-family: sans-serif;
  font-weight: 500;
  text-align: center;
  color: #FFF;
}

#nav {
  padding: 30px;
}

.form-div {
  margin: 20px;
  label {
    display: inline-block;
    width: 170px;
    &.keepConnexion {
      text-align: left;
      margin-left: 10px;
    }
    &.search {
      width: 100px;
    }
  }
  .submit {
    font-size: 1rem;
    cursor: pointer;
    padding: 5px;
  }
}

.button {
  font-size: 0.85rem;
  margin: 20px;
}
</style>
