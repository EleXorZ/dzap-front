<template>
  <div id="app">
    <header>
      <img alt="Vue logo" src="./assets/logo.svg" width="125" height="125" />
      <h1>Bienvenue sur DZAP Front</h1>
    </header>

    <main>
      <HelloWorld msg="Votre application Vue.js est prête !" />
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

main {
  margin-top: 2rem;
}
</style>

