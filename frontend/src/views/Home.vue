<template>
  <div class="home">
    <header>
     
    </header>
    <main>
      <h1>Bienvenue dans le réseau social de votre societé</h1>
      
      <p class="welcomeText">Pour s'inscrire ou se connecter : <router-link to="/account">Mon Compte</router-link>
      <br>

      <br>
      Pour accéder au forum : <router-link to="/forum">Forum</router-link></p>
      
     
    </main>
    <footer class="footer">
      {{ copyright }}
    </footer>
  </div>
</template>







<script>
  export default {
    name: 'Home',
    computed: {
      copyright() {
        const currentYear = new Date().getFullYear();
        return `Copyright Groupomania ${currentYear}`;
      }
    }
  }
</script>





<style>
.welcomeText {
  text-align: center;
  font-weight: 700;
}



footer {
background: red;
position: absolute;
bottom: 0;
left: 0;
right: 0;
}

</style>
