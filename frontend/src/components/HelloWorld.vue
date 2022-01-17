<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p v-if="abonnes == 0">Aucun abonnées pour le moment 😔</p>
    <p v-else-if="abonnes == 1">{{ abonnes }} personne est abonné 😅</p>
    <p v-else>{{ abonnes }} personnes se sont abonnées 😀</p>
    <button v-on:click="subscribe()">S'abonner</button>
    <div class="comment" v-for="(comment, idx) in comments" v-bind:key="idx">
      <h3>{{ comment.nom }}</h3>
      <p>{{ comment.commentaire }}</p>
      <span v-for="i in comment.note" v-bind:key="i"> 🍌</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Helloword",
  props: {
    msg: String,
  },
  data: function () {
    return {
      abonnes: 0,
      comments: [
        {
          nom: "mrTchou",
          commentaire: "allez mr tchou t'es le meilleur",
          note: 9,
        },
        {
          nom: "mrTchou",
          commentaire: "oui je sais",
          note: 11,
        },
      ],
    };
  },
  methods: {
    subscribe: function () {
      this.abonnes++;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

p {
  font-size: 18px;
}
</style>
