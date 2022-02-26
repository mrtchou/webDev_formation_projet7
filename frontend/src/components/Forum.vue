<template>
  <b-container display="flex">
    <Header
      @display-profile="switchDisplayProfile"
      :displayProfile="displayProfile"
    />
    <Profile
      @display-profile="switchDisplayProfile"
      v-show="displayProfile"
      :userId="userId"
      :token="token"
      :displayProfile="displayProfile"
    />

    <!--Affichage de l'en-tête d'un utilisateur dans nouvel affichage-->
    <b-row v-show="displayPostByProfile" class="mb-4">
      <b-col align="center" lg="5">
        <h1>Profil de {{ userName }}</h1>
        <p>{{ userEmail }}</p>

        <div>
          <b-button
            pill
            size="sm"
            class="back-button"
            @click="
              switchDisplayPostByProfile(false);
              getPosts();
            "
            >Retour vers le forum</b-button
          >
        </div>
      </b-col>
    </b-row>

    <!--Insertion article-->
    <div v-show="!displayPostByProfile">
      <b-row v-show="!displayProfile">
        <b-col>
          <b-form-textarea
            maxlength="1000"
            id="textarea-rows"
            placeholder="Partagez un texte qui merite d'etre partagé avec vos collègues!"
            @input="lenghtCheck"
            rows="3"
            class="text-area"
            v-model="postTextArea"
          ></b-form-textarea>

          <p class="error-message font-weight-bold text-center mt-2">
            {{ postError }}
          </p>

          <div>
            <b-button
              size="sm"
              class="mb-2 bg-primary text-white btn-lg btn-block"
              @click="createPost"
              >Poster</b-button
            >
            <b-button
              size="sm"
              class="mb-3 reset-button btn-lg btn"
              @click="resetPost"
              >Effacer tout le texte</b-button
            >
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="postData in posts"
        :key="postData.id"
        v-show="!displayProfile"
      >
        <b-col>
          <Post
            @users-posts="usersPosts"
            @post-by-profile="switchDisplayPostByProfile"
            :post="postData"
            :admin="admin"
            :userId="userId"
            :token="token"
          ></Post>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>
 
<script>
import Header from "./Header.vue";
import Post from "./Post.vue";
import Profile from "./Profile.vue";
import { url } from "../main";
export default {
  name: "Forum",
  components: {
    Header,
    Post,
    Profile,
  },
  data() {
    return {
      postError: "",
      userProfilePicture: "",
      userName: "",
      userEmail: "",
      displayPostByProfile: false,
      displayCommands: false,
      displayProfile: false,
      posts: [],
      users: [],
      token: "",
      userId: "",
      admin: false,
      error: {},
      postTextArea: "",
      testKey: "",
    };
  },
  watch: {
    //Surveille les posts dans changement/rechargement
    posts() {
      if (this.posts !== "undefined" && this.posts.length > 0) {
        //evite erreur si aucun post publié
        this.userName = this.posts[0].user;
        if (this.posts[0].email.startsWith("ancien employé")) {
          this.userEmail = "";
        } else {
          this.userEmail = this.posts[0].email;
        }
      }
    },
    //si affichage du profil, alors cache les articles
    displayProfile() {
      if (this.displayProfile === true) {
        this.displayPostByProfile = false;
      }
    },
  },
  computed: {
    headers() {
      return { headers: { Authorization: this.token, userId: this.userId } };
    },
  },
  //Validation du state de l'utilisateur / donc utilisateur vient apres creation
  created() {
    this.getUser();
  },
  //construction du composant post une fois que le dom est monté
  mounted() {
    this.getPosts();
  },
  methods: {
    lenghtCheck() {
      if (this.postTextArea.length > 1000) {
        this.postError =
          "Votre message est trop long. Essayez de resumer en un texte plus court";
      } else {
        this.postError = "";
      }
    },
    createPost() {
      if (!this.postTextArea) {
        this.postError = "Votre publication est vide, et ne peut etre creer. ";
        setTimeout(() => {
          this.postError = "";
        }, 7000);
        return;
      }
      //FormData sera rempli avec clés/valeurs du formulaire
      let formData = new FormData();
      formData.append("content", this.postTextArea);
      formData.append("user_id", this.userId);

      //envoi par post formData puis vider et vider textArea
      this.$http
        .post(url + "posts", formData, this.headers)
        .then(() => {
          this.resetPost();
          this.getPosts();
        })
        .catch(() => {
          this.postError =
            "Un problème est survenu au moment de la creation de l'article, veuillez réessayer";
        });
    },
    getPosts() {
      //utilisée pour charger les posts et pour recharger le composant
      this.$http.get(url + "posts", this.headers).then((res) => {
        this.posts = res.data;
      });
    },
    usersPosts(data) {
      //charger post par utilisateur (function a terminer!)
      this.posts = data;
    },
    //afficher post par profil, ou post juste
    switchDisplayPostByProfile(data) {
      this.displayPostByProfile = data;
    },
    switchDisplayProfile(data) {
      this.displayProfile = data;
    },
    //lancé a created pour vérifier l'authenticité du user et si admin ou pas
    getUser() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser) {
        this.token = currentUser.token;
        this.userId = currentUser.userId;
        this.$http
          .get(url + "users/" + currentUser.userId, this.headers)
          .then((res) => {
            this.admin = res.data.admin;
          })
          .catch(() => {
            this.$router.push("/login");
          });
      } else {
        this.$router.push("/login");
      }
    },
    resetPost() {
      this.postTextArea = "";
    },
  },
};
</script>





<style>
body {
  margin: 5%;
  font-family: Arial, Helvetica, sans-serif;
}
</style>

<style scoped>
.text-area {
  border: 1px solid#d0f0cb;
  display: flex;
  margin-right: auto;
}
.text-area:focus {
  outline: none !important;
  border: 1px solid #ed9b67;
  box-shadow: 0 0 10px #ffa5a5;
}
.post {
  border-bottom: 0.15em solid #fd2d01;
  margin: 25px;
  padding-right: 0;
  padding-left: 0;
}
.send-button {
  background-color: #6ee4ff;
  color: black;
  border: solid 1px #a6fa57;
}
.send-button:hover {
  background: #2eee27;
}
.reset-button:hover {
  background: #ffe4e4;
}
.post-header {
  background-color: #ffd7d7;
  font-size: 1em;
  border-radius: 80px 30px;
  text-align: center;
}
.back-button {
  background-color: transparent;
  border: solid 1px #ffb3b3;
  color: #e42701;
}
.back-button:hover {
  background: #ffe4e4;
}
.button-col {
  display: flex;
  width: 7em;
  flex-direction: column;
}
.error-message {
  color: #fd2d01;
}
.breadcrumb {
  cursor: pointer;
}
.breadcrumb:hover {
  background-color: #ebe0e0;
}
@media screen and (max-width: 767px) {
  .button-col {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    width: auto;
  }
}
@media screen and (max-width: 560px) {
  h1 {
    font-size: 2em;
  }
}
</style>
