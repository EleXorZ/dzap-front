<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      Vous avez créé avec succès votre projet Vue.js avec Vite.
    </p>

    <h3>Prochaines étapes :</h3>
    <ul>
      <li>
        <a href="https://vuejs.org/guide/introduction.html" target="_blank">
          Documentation Vue.js
        </a>
      </li>
      <li>
        <a href="https://vitejs.dev/guide/" target="_blank">
          Documentation Vite
        </a>
      </li>
      <li>
        <a href="https://router.vuejs.org/" target="_blank">
          Vue Router (pour la navigation)
        </a>
      </li>
      <li>
        <a href="https://pinia.vuejs.org/" target="_blank">
          Pinia (gestion d'état)
        </a>
      </li>
    </ul>

    <div class="commands">
      <h3>Commandes disponibles :</h3>
      <code>npm run dev</code> - Démarrer le serveur de développement<br>
      <code>npm run build</code> - Construire pour la production<br>
      <code>npm run preview</code> - Prévisualiser la version de production
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.hello {
  padding: 2rem;
}

h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
}

h3 {
  margin: 2rem 0 1rem;
  color: #2c3e50;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.commands {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-radius: 8px;
}

code {
  background-color: #e5e7eb;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #1f2937;
}
</style>

