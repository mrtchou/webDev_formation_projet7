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
           :isAdmin="isAdmin"
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
      admin: "",
      error: {},
      postTextArea: "",
      testKey: "",
    };
  },
  watch: {
    //Surveille les posts dans le cas de rechargement
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
  //Validation du state de l'utilisateur
  created() {
    this.getUser();
  },
  //construction du composant post
  mounted() {
    this.getPosts();
  },

  methods: {
    lenghtCheck() {
      if (this.postTextArea.length === 1000) {
        this.postError = "Votre message est trop long";
      } else {
        this.postError = "";
      }
    },

    createPost() {
      if (!this.postTextArea) {
        this.postError = "Votre publication est vide";
        setTimeout(() => {
          this.postError = "";
        }, 7000);
        return;
      }
      let formData = new FormData();
      formData.append("content", this.postTextArea);
      formData.append("user_id", this.userId);
      this.$http
        .post(url + "posts", formData, this.headers)
        .then(() => {
          this.resetPost();
          this.getPosts();
        })
        .catch(() => {
          this.postError = "Un problème est survenu, veuillez réessayer";
        });
    },
    getPosts() {
      //utilisée pour charger les posts et pour recharger le composant
      this.$http.get(url + "posts", this.headers).then((res) => {
        this.posts = res.data;
      });
    },
    usersPosts(data) {
      //charger post par utilisateur
      this.posts = data;
    },
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
            this.admin = res.data.admin; //a corriger apres la reglage backend mysql
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



