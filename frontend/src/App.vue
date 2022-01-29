<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Accueil</router-link> |
      <router-link to="/account">Mon Compte</router-link> |
      <router-link to="/forum">Forum</router-link>
    </div>
    <router-view />
    <footer class="footer">
      {{ copyright }}
    </footer>
  </div>
</template>



<script>
export default {
  computed: {
    copyright() {
      const currentYear = new Date().getFullYear();
      return `Copyright Groupomania ${currentYear}`;
    },
  },
};
</script>




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

button,
input,
textarea {
  color: rgb(0, 0, 0);
  background-color: rgb(255, 255, 255);
}
.submit {
  cursor: pointer;
}
button {
  padding: 5px;
  cursor: pointer;
  background-color: rgb(138, 232, 230);
  font-size: 0.85rem;
  display: flexbox;
}

#app {
  font-family: sans-serif;
  font-weight: 500;
  text-align: center;
  color: #fff;
}

#nav {
  padding: 30px;
}

.form-div {
  margin: 7px;
}

.form {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
}

.keepConnexion {
  cursor: pointer;
}

footer {
  background: red;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
