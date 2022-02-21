<template>
  <b-container>
    <b-row>
      <b-col
        sm="12"
        offset-md="1"
        md="10"
        offset-lg="2"
        lg="8"
        class="post mb-4"
      >
        <div class="post-header mb-3">
          <p class="mb-0" align="center">
            <span class="user-name font-weight-bolder" @click="getUsersPosts">
              {{ post.user }}
            </span>
            le {{ post.creationDate }}
          </p>
        </div>

        <!-- Vue pour modification -->
        <b-row v-show="displayModifyPost">
          <b-col cols="4" sm="3" md="2" lg="2" align="center"> </b-col>
          <b-col cols="8" sm="8=9" md="8" lg="8" align="center">
            <b-form-textarea
              class="text-area"
              rows="3"
              maxlength="1000"
              @input="lenghtCheck"
              v-model="modifyTextArea"
            ></b-form-textarea>
            <p align="center" class="error-message font-weight-bold mt-2">
              {{ error }}
            </p>
          </b-col>
          <b-col cols="12" sm="12" md="2" lg="2" align="center">
            <div class="button-col">
              <b-button
                pill
                size="sm"
                class="mb-3 send-button"
                @click="modifyPost"
                >Envoyer</b-button
              >
              <b-button
                pill
                size="sm"
                class="mb-3 reset-button"
                @click="resetModifyPost"
                >Annuler</b-button
              >
            </div>
          </b-col>
        </b-row>

        <!-- Vue affichage -->
        <b-row v-show="!displayModifyPost">
          <b-col cols="12" sm="10" md="7" lg="7">
            <div class="post-content pr-2 pl-2">{{ post.content }}</div>
          </b-col>

          <b-col cols="12" sm="2" md="2" lg="2">
            <div align="center">
              <b-button-group v-show="displayDropdownButton">
                <b-dropdown
                  variant="outline-danger"
                  size="sm"
                  right
                  text=". . ."
                >
                  <b-dropdown-item
                    v-if="userId === post.userId"
                    @click="displaySwitch"
                    >Modifier</b-dropdown-item
                  >
                  <b-dropdown-item
                    v-if="admin || userId === post.userId"
                    @click="deletePost"
                    >Supprimer</b-dropdown-item
                  >
                </b-dropdown>
              </b-button-group>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>           

<script>
import { url } from "../main";

export default {
  name: "Post",

  data() {
    return {
      displayModifyPost: false,
      displayDropdownButton: false,
      modifyTextArea: this.post.content,
      uri: "posts/" + this.post.id,
      error: "",
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  computed: {
    body() {
      //content du post pour envoyer à l'api
      return {
        content: this.modifyTextArea,
      };
    },
  },
  props: {
    post: {
      type: Object,
    },
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    admin: {
      type: Boolean,
    },
  },
  created() {
    this.switchDropdownButton();
  },

  methods: {
    lenghtCheck() {
      if (this.modifyTextArea.length > 1000) {
        this.error = "Votre message est trop long";
      } else {
        this.error = "";
      }
    },
    getUsersPosts() {
      this.$http
        .get(url + "posts/users/" + this.post.userId, this.headers)
        .then((res) => {
          this.$emit("users-posts", res.data);
          this.$emit("post-by-profile", true);
        });
    },

    //affiche le dropbutton si admin sinon pas d'affichage
    switchDropdownButton() {
    
      if (this.admin === true || this.userId === this.post.userId) {
        this.displayDropdownButton = !this.displayDropdownButton;
      }
    },

    displaySwitch() {
      //permet de passer de l'affichage du post à la modification
      (this.displayModifyPost = !this.displayModifyPost),
        (this.displayDropdownButton = !this.displayDropdownButton);
    },

    getOnePost() {
      //rafraichir le post après annulation de modification
      this.$http
        .get(url + "posts/" + this.post.id, this.headers)
        .then((res) => {
          this.modifyTextArea = res.data.content;
        });
    },

    deletePost() {
      this.$http
        .delete(url + this.uri, this.headers)
        .then(() => {
          this.$parent.getPosts();
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },

    sendModifyPost(data) {
      this.$http
        .put(url + this.uri, data, this.headers)
        .then(() => {
          this.$parent.getPosts(); //rafraichir tous les posts

          this.displaySwitch();
        })
        .catch(() => {
          this.error = "Un problème est survenu, veuillez réessayer";
        });
    },

    modifyPost() {
      if (
        (this.file === "delete" || this.file === "") &&
        this.body.content === ""
      ) {
        this.deletePost();
      } else if (this.file === "delete") {
        let formData = new FormData();
        formData.append("content", this.body.content);
        this.sendModifyPost(formData);
      } else {
        let formData = new FormData();
        formData.append("content", this.body.content);
        this.sendModifyPost(formData);
      }
    },

    resetModifyPost() {
      this.getOnePost();
      this.displaySwitch();
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
  border: 1px solid#c4f5bd;
  display: flex;
  margin-right: auto;
}
.text-area:focus {
  outline: none !important;
  border: 1px solid #73ec3f;
  box-shadow: 0 0 10px #ffa5a5;
}
.post {
  border-bottom: 0.15em solid #fd2d01;
  padding-right: 0;
  padding-left: 0;
}
.send-button {
  background-color: #6bfaa2;
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
