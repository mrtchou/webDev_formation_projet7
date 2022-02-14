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

        <!-- Vue pour modification apparait au click sur trois points-->
        <b-row v-show="displayModifyPost">
          <b-col cols="" sm="8=9" md="8" lg="8" align="center">
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

        <!-- Vue affichage des articles-->
        <b-row v-show="!displayModifyPost">
          <b-col cols="12" sm="10" md="10" lg="10">
            <div class="post-content pr-2 pl-2">{{ post.content }}</div>
          </b-col>
          <b-col cols="12" sm="12" md="2" lg="2">
            <div align="center">
              <!--modification article -->
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
      if (this.modifyTextArea.length === 1500) {
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

    //affiche le dropbutton si use ou admin
    switchDropdownButton() {
      if (this.admin === true || this.userId === this.post.userId) {
        this.displayDropdownButton = !this.displayDropdownButton;
      }
    },

    displaySwitch() {
      //passer de l'affichage à modification
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
      if (this.body.content === "") {
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

<style scoped>
.post {
  padding-right: 0;
  padding-left: 0;
}
.post-content {
  padding-bottom: 10px;
  word-wrap: break-word;
}
.post-header {
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #7cddee;
  font-size: 1em;
  border-radius: 7px;
}
.profile-picture {
  width: 2em;
  height: 2em;
  margin-bottom: 4px;
  margin-top: 4px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 50%;
}
.user-name {
  cursor: pointer;
}
.text-area {
  resize: none;
  border: 1px solid#f5dd07;
}
.text-area:focus {
  outline: none !important;
  border: 1px solid#f5dd07;
  box-shadow: 0 0 10px #acecb1;
}
.send-button {
  background-color: #43ee14;
  color: black;
  border: solid 1px #3cfd01;
}
.send-button:hover {
  background: #ffb3b3;
}
.reset-button {
  background-color: transparent;
  border: solid 1px #ffb3b3;
  color: #e42701;
}
.reset-button:hover {
  background: #ffe4e4;
}
.button-col {
  display: flex;
  flex-direction: column;
}
.error-message {
  color: #fd2d01;
}
.post-image {
  max-width: 10em;
  height: 99%;
}
.image-styling {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.image-input {
  display: block;
  width: 5.5em;
  height: 5.5em;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.image-input:hover {
  opacity: 0.5;
}
.image-area {
  background: #ee1e1e;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1em;
  text-align: center;
  border: solid 1px #fd2d01;
  border-radius: 5px;
}
.image-area:hover {
  background: #ffb3b3;
}
.file-input {
  display: none;
}
.remove-image {
  display: none;
  position: absolute;
  top: -0.5em;
  right: 0.5em;
  border-radius: 10em;
  padding: 2px 6px 3px;
  text-decoration: none;
  font: 700 21px/20px sans-serif;
  background: #555;
  border: 3px solid #fff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
.remove-image:hover {
  background: #e54e4e;
}
.remove-image:active {
  background: #e54e4e;
}
@media screen and (max-width: 767px) {
  .post-image {
    max-width: 7.5em;
    max-height: 7.5em;
  }
  .button-col {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    margin-top: 1em;
  }
}
@media screen and (max-width: 560px) {
  .post-header {
    font-size: 0.9em;
  }
  .post-content {
    text-align: center;
  }
  .post-image {
    margin-bottom: 1.5em;
  }
  .button-col {
    margin-top: 1em;
  }
}
@media screen and (max-width: 440px) {
  .post-image {
    max-width: 7em;
    max-height: 7em;
  }
  .post-content {
    font-size: 0.9em;
  }
  .post-header {
    font-size: 0.8em;
  }
}
</style>
