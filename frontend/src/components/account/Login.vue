<template>
  <div>
    <form class="form">
      <div class="form-div">
        <label for="pseudo"></label>
        <input
          type="text"
          placeholder="Pseudo"
          v-model="user.pseudo"
          maxlength="20"
          id="pseudo"
        />
      </div>
      <div class="form-div">
        <label for="password"></label>
        <input
          type="password"
          placeholder="Mot de passe"
          v-model="user.password"
          maxlength="20"
          id="password"
        />
      </div>

      <div class="form-div">
        <input
          type="checkbox"
          @change="keepUserConnected"
          class="keepConnexion"
          id="keepConnexion"
        />
        <label for="keepConnexion" class="keepConnexion"
          >Rester connecté
        </label>
      </div>

      <div class="form-div">
        <input
          type="submit"
          value="Connexion"
          class="submit"
          @click.prevent="login"
        />
      </div>
      <button class="button" @click="getSignup">Pas encore inscrit ?</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Login",
  props: {
    user: {
      type: Object,
      required: true,
    },

    keepUserConnected: {
      type: Function,
      required: true,
    },
  },
  methods: {
    ...mapActions(["getSignup", "login"]),
  },
};
</script>



<style>
.form {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.form-div {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.keepConnexion {
  cursor: pointer;
}
</style>

