<template>
  <div>
    <form class="form">
      <div class="form-div">
        <input
          type="text"
          v-model="user.lastName"
          maxlength="30"
          id="nom"
          placeholder="Votre nom"
        />
      </div>
      <div class="form-div">
        <input
          type="text"
          v-model="user.firstName"
          maxlength="30"
          id="prenom"
          placeholder="Votre prenom"
        />
      </div>
      <div class="form-div">
        <input
          type="text"
          v-model="user.email"
          maxlength="50"
          id="email"
          placeholder="Votre adresse email"
        />
      </div>
      <div class="form-div">
        <input
          type="text"
          v-model="user.pseudo"
          maxlength="20"
          id="pseudo"
          placeholder="Un pseudo"
        />
      </div>
      <div class="form-div">
        <input
          type="password"
          v-model="user.password"
          maxlength="20"
          id="password"
          placeholder="Un mot de passe"
        />
      </div>

      <div class="form-div">
        <input type="checkbox" id="keepConnexion" @change="keepUserConnected" />
        <label for="keepConnexion" class="keepConnexion">Rester connecté</label>
      </div>
      <div class="form-div">
        <input
          type="submit"
          value="Valider l'inscription"
          class="submit"
          @click.prevent="signup"
        />
      </div>
      <button class="button" @click="getLogin">Déjà inscrit ?</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Signup",
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
    ...mapActions(["getLogin", "signup"]),
  },
};
</script>







<style scoped>
.form-div {
  width: 29vw;
}
input {
  text-align: center;
  width: 29vw;
}
</style>
