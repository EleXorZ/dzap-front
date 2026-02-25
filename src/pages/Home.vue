<template>
  <div class="home">
    <!-- Header avec logo -->
    <header class="header">
      <img
        src="../assets/logo.png"
        alt="Logo DZAP"
        class="logo"
      />
    </header>

    <!-- Contenu principal (première section - sans scroll) -->
    <main class="hero-section">
      <!-- Avatar circulaire -->
      <div class="avatar-container">
        <img
          src="../assets/avatar.jpg"
          alt="Profil"
          class="avatar"
        />
      </div>

      <!-- Titre principal -->
      <h1 class="hero-title">J'apprends l'investissement immobilier de zéro. Et je partage tout.</h1>

      <!-- Description -->
      <p class="hero-description">
        Je ne suis pas un expert. Je n'ai pas de formation à vous vendre. Juste un débutant
        curieux qui a décidé d'acheter son premier bien et de documenter 100% du
        processus, en toute transparence.
      </p>

      <!-- Newsletter CTA -->
      <p class="newsletter-text">✍️ Newsletter écrite à la main, sans IA</p>

      <!-- Form Email -->
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <input
          v-model="firstName"
          type="text"
          placeholder="Prénom"
          class="email-input"
          required
          :disabled="loading"
          aria-label="Ton prénom"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="email-input"
          required
          :disabled="loading"
          aria-label="Adresse email pour la newsletter"
        />
        <button
          type="submit"
          class="subscribe-button"
          :disabled="loading"
        >
          {{ loading ? 'Inscription en cours...' : 'Rejoindre' }}
        </button>
      </form>

      <!-- Message de succès -->
      <div v-if="successMessage" class="success-message">
        ✅ {{ successMessage }}
      </div>

      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="error-message">
        ❌ {{ errorMessage }}
      </div>

      <!-- Disclaimer -->
      <p class="disclaimer">Vous pourrez vous désinscrire à tout moment.</p>
    </main>
  </div>
</template>

<script>
import { newsletterService } from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      firstName: '',
      email: '',
      loading: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      const result = await newsletterService.subscribe(this.email, this.firstName)

      if (result.success) {
        this.successMessage = 'Inscription réussie ! Merci de nous avoir rejoint 🎉'
        this.firstName = ''
        this.email = ''

        // Masquer le message après 5 secondes
        setTimeout(() => {
          this.successMessage = ''
        }, 5000)
      } else {
        this.errorMessage = result.error
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem 1.5rem;
  background-color: #0a0a0a;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  height: 100px;
  width: auto;
  object-fit: contain;
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 0.5rem;
  text-align: center;
  gap: 0.4rem;
}

/* Avatar */
.avatar-container {
  margin-bottom: 0.1rem;
  flex-shrink: 0;
  padding: 6px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  object-fit: cover;
  display: block;
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.6), 0 0 60px rgba(0, 102, 255, 0.3);
}

/* Typography */
.hero-title {
  font-size: clamp(1.3rem, 3.5vw, 2.2rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 0.1rem;
  max-width: 900px;
}

.hero-description {
  font-size: clamp(0.8rem, 1.5vw, 0.95rem);
  line-height: 1.4;
  color: #d1d1d1;
  max-width: 800px;
  margin-bottom: 0.4rem;
  font-weight: 400;
}

.newsletter-text {
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  margin-bottom: 0.3rem;
  color: #ffffff;
}

/* Form */
.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 0.3rem;
}

.email-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: #ffffff;
  color: #0a0a0a;
  font-family: inherit;
}

.email-input::placeholder {
  color: #999999;
}

.email-input:focus {
  outline: 2px solid #0066ff;
  outline-offset: 2px;
}

.subscribe-button {
  width: 100%;
  padding: 0.6rem 1.2rem;
  background-color: #0066ff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.subscribe-button:hover:not(:disabled) {
  background-color: #0052cc;
  transform: translateY(-2px);
}

.subscribe-button:focus {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.subscribe-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Disclaimer */
.disclaimer {
  font-size: 0.75rem;
  color: #999999;
  max-width: 800px;
}

/* Messages */
.success-message {
  font-size: 0.9rem;
  color: #4ade80;
  background-color: rgba(74, 222, 128, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 3px solid #4ade80;
  max-width: 400px;
  text-align: left;
  animation: slideIn 0.3s ease-out;
}

.error-message {
  font-size: 0.9rem;
  color: #f87171;
  background-color: rgba(248, 113, 113, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 3px solid #f87171;
  max-width: 400px;
  text-align: left;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
  }

  .hero-section {
    padding: 1rem 0.75rem;
    min-height: auto;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .avatar {
    width: 110px;
    height: 110px;
  }

  .newsletter-form {
    flex-direction: column;
    gap: 0.5rem;
  }

  .email-input,
  .subscribe-button {
    width: 100%;
  }

  .hero-title {
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 100px;
    height: 100px;
    border-width: 2px;
  }

  .hero-section {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .email-input,
  .subscribe-button {
    padding: 0.65rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>

