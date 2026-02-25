uis <template>
  <div class="quiz-container">
    <!-- Écran d'introduction -->
    <div v-if="!quizStarted && !quizSubmitted" class="intro-screen">
      <header class="header">
        <img
          src="../assets/logo.png"
          alt="Logo DZAP"
          class="logo"
        />
      </header>

      <main class="intro-content">
        <h1 class="intro-title">{{ quizInfo.title }}</h1>
        <p class="intro-description">{{ quizInfo.description }}</p>

        <div class="intro-info">
          <div class="info-item">
            <span class="info-label">📊 Questions</span>
            <span class="info-value">{{ questions.length || quizInfo.totalQuestions || 'Chargement...' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">⏱️ Durée estimée</span>
            <span class="info-value">{{ quizInfo.estimatedTimeMinutes || 'Chargement...' }} min</span>
          </div>
        </div>

        <button @click="startQuiz" class="start-button" :disabled="loading">
          {{ loading ? 'Chargement...' : 'Commencer le test' }}
        </button>

        <p v-if="errorMessage" class="error-message">
          ❌ {{ errorMessage }}
        </p>
      </main>
    </div>

    <!-- Écran du quiz -->
    <div v-else-if="quizStarted && !showPersonalInfoForm && !quizSubmitted" class="quiz-screen">
      <header class="quiz-header">
        <img
          src="../assets/logo.png"
          alt="Logo DZAP"
          class="logo"
        />
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">{{ currentQuestionIndex + 1 }}/{{ questions.length }}</div>
      </header>

      <main class="quiz-content">
        <!-- Question -->
        <div class="question-section">
          <h2 class="question-text">{{ currentQuestion.questionText }}</h2>
        </div>

        <!-- Réponses -->
        <div class="answers-section">
          <button
            v-for="answer in currentQuestion.answers"
            :key="answer.id"
            @click="selectAnswer(answer.id)"
            class="answer-card"
            :class="{ selected: selectedAnswerId === answer.id }"
          >
            <span class="answer-icon">{{ selectedAnswerId === answer.id ? '✓' : '' }}</span>
            <span class="answer-text">{{ answer.answerText }}</span>
          </button>
        </div>

        <!-- Boutons de navigation -->
        <div class="navigation-buttons">
          <button
            @click="previousQuestion"
            class="nav-button prev-button"
            :disabled="currentQuestionIndex === 0"
          >
            ← Retour
          </button>
          <button
            @click="nextQuestion"
            class="nav-button next-button"
            :disabled="!selectedAnswerId"
          >
            Continuer →
          </button>
        </div>
      </main>
    </div>

    <!-- Écran des informations personnelles -->
    <div v-else-if="showPersonalInfoForm && !quizSubmitted" class="personal-info-screen">
      <header class="header">
        <img
          src="../assets/logo.png"
          alt="Logo DZAP"
          class="logo"
        />
      </header>

      <main class="personal-info-content">
        <h2 class="form-title">Dernière étape</h2>
        <p class="form-subtitle">Entre ton prénom et ton email pour recevoir le résultat.</p>

        <form @submit.prevent="submitQuiz" class="personal-info-form">
          <div class="form-group">
            <label for="firstName">Ton prénom</label>
            <input
              id="firstName"
              v-model="personalInfo.firstName"
              type="text"
              placeholder="Jean"
              required
              :disabled="submitting"
            />
          </div>

          <div class="form-group">
            <label for="email">Ton adresse email</label>
            <input
              id="email"
              v-model="personalInfo.email"
              type="email"
              placeholder="jean@example.com"
              required
              :disabled="submitting"
            />
          </div>

          <div class="form-group checkbox-group">
            <input
              id="newsletter"
              v-model="personalInfo.subscribeNewsletter"
              type="checkbox"
              :disabled="submitting"
            />
            <label for="newsletter">Je veux recevoir la newsletter</label>
          </div>

          <button
            type="submit"
            class="submit-button"
            :disabled="submitting"
          >
            {{ submitting ? 'Envoi en cours...' : 'Recevoir le résultat' }}
          </button>
        </form>

        <p v-if="errorMessage" class="error-message">
          ❌ {{ errorMessage }}
        </p>
      </main>
    </div>

    <!-- Écran de confirmation -->
    <div v-else-if="quizSubmitted" class="submitted-screen">
      <header class="header">
        <img
          src="../assets/logo.png"
          alt="Logo DZAP"
          class="logo"
        />
      </header>

      <main class="submitted-content">
        <div class="success-icon">✓</div>
        <h2 class="success-title">C'est parti !</h2>
        <p class="success-message">
          Ton profil d'investisseur t'attend dans ta boîte mail.
        </p>
        <p class="success-subtitle">
          Vérifie tes emails (et tes spams) pour découvrir ton profil d'investisseur et les stratégies adaptées à ta situation.
        </p>

        <router-link to="/" class="back-home-button">
          ← Retour à l'accueil
        </router-link>
      </main>
    </div>
  </div>
</template>

<script>
import { quizService } from '../services/api'

export default {
  name: 'ProfilInvestisseur',
  data() {
    return {
      quizStarted: false,
      quizSubmitted: false,
      showPersonalInfoForm: false,
      loading: false,
      submitting: false,
      errorMessage: '',
      currentQuestionIndex: 0,
      selectedAnswerId: null,
      questions: [],
      quizInfo: {
        title: '',
        description: '',
        estimatedTimeMinutes: 0,
        totalQuestions: 0
      },
      answers: {},
      personalInfo: {
        firstName: '',
        email: '',
        subscribeNewsletter: true
      }
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {}
    },
    progressPercentage() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100
    }
  },
  mounted() {
    // Charger les informations du quiz au chargement de la page
    this.loadQuizInfo()
  },
  methods: {
    async loadQuizInfo() {
      try {
        // Récupérer les informations complètes du quiz
        const result = await quizService.getQuestions()

        if (result.success) {
          // Mettre à jour quizInfo avec les données reçues
          this.quizInfo = {
            title: result.data.info?.title || '',
            description: result.data.info?.description || '',
            estimatedTimeMinutes: result.data.info?.estimatedTimeMinutes || 0,
            totalQuestions: result.data.info?.totalQuestions || result.data.questions?.length || 0
          }
          // Charger aussi les questions pour affichage du nombre
          this.questions = result.data.questions || []
        } else {
          this.errorMessage = result.error
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        this.errorMessage = 'Erreur lors du chargement du quiz'
      }
    },
    async startQuiz() {
      // Les questions sont déjà chargées, on démarre juste le quiz
      if (this.questions.length === 0) {
        this.loading = true
        this.errorMessage = ''

        const result = await quizService.getQuestions()

        if (result.success) {
          this.questions = result.data.questions
          this.quizInfo = result.data.info
          this.quizStarted = true
          this.selectedAnswerId = null
        } else {
          this.errorMessage = result.error
        }

        this.loading = false
      } else {
        // Questions déjà chargées
        this.quizStarted = true
        this.selectedAnswerId = null
      }
    },
    selectAnswer(answerId) {
      this.selectedAnswerId = answerId
      this.answers[this.currentQuestion.id] = answerId
    },
    nextQuestion() {
      // Stocker la réponse sélectionnée
      if (this.selectedAnswerId) {
        this.answers[this.currentQuestion.id] = this.selectedAnswerId
      }

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
        this.selectedAnswerId = this.answers[this.currentQuestion.id] || null
      } else {
        // Dernière question, afficher le formulaire
        this.showPersonalInfoForm = true
      }
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.selectedAnswerId = this.answers[this.currentQuestion.id] || null
      }
    },
    async submitQuiz() {
      this.submitting = true
      this.errorMessage = ''

      const answerIds = Object.values(this.answers)

      const result = await quizService.submitQuiz(
        answerIds,
        this.personalInfo.email,
        this.personalInfo.firstName,
        '',
        this.personalInfo.subscribeNewsletter
      )

      if (result.success) {
        this.quizSubmitted = true
      } else {
        this.errorMessage = result.error
      }

      this.submitting = false
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

.quiz-container {
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem 1.5rem;
  background-color: #0a0a0a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  height: 70px;
  width: auto;
  object-fit: contain;
}

/* Écran d'introduction */
.intro-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.intro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
  text-align: center;
  gap: 2rem;
}

.intro-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  max-width: 700px;
}

.intro-description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #d1d1d1;
  line-height: 1.6;
  max-width: 600px;
}

.intro-info {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1rem 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.9rem;
  color: #999999;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.start-button {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 250px;
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
}

.start-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Écran du quiz */
.quiz-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 2rem;
}

.quiz-header {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-bar {
  width: 100%;
  max-width: 700px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066ff, #00d4ff);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #999999;
  text-align: center;
}

.quiz-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.5rem 1rem;
  gap: 1.25rem;
}

.question-section {
  text-align: center;
}

.question-text {
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 700;
  line-height: 1.3;
  max-width: 700px;
  margin: 0 auto;
}

.answers-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.answer-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.25rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 0.9rem;
}

.answer-card:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 102, 255, 0.5);
}

.answer-card.selected {
  background-color: rgba(0, 102, 255, 0.15);
  border-color: #0066ff;
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.2);
}

.answer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid #0066ff;
  border-radius: 4px;
  font-weight: 700;
  flex-shrink: 0;
}

.answer-card:not(.selected) .answer-icon {
  border-color: rgba(255, 255, 255, 0.3);
}

.answer-text {
  flex: 1;
}

.navigation-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.nav-button {
  flex: 1;
  padding: 0.65rem 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background-color: transparent;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  border-color: #0066ff;
  color: #0066ff;
}

.nav-button.prev-button:hover:not(:disabled) {
  background-color: rgba(0, 102, 255, 0.1);
}

.nav-button.next-button:hover:not(:disabled) {
  background-color: #0066ff;
  color: #ffffff;
  border-color: #0066ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.next-button:not(:disabled) {
  background-color: #0066ff;
  border-color: #0066ff;
}

/* Écran des infos personnelles */
.personal-info-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.personal-info-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
  text-align: center;
  gap: 2rem;
}

.form-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  line-height: 1.2;
}

.form-subtitle {
  font-size: 1rem;
  color: #d1d1d1;
}

.personal-info-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.form-group.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(0, 102, 255, 0.08);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 102, 255, 0.2);
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #d1d1d1;
}

.form-group.checkbox label {
  color: #d1d1d1;
  cursor: pointer;
}

.form-group.checkbox-group label {
  color: #ffffff;
  cursor: pointer;
  font-size: 0.95rem;
  margin: 0;
}

.form-group input[type="text"],
.form-group input[type="email"] {
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #0a0a0a;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="email"]:focus {
  background-color: #ffffff;
  border-color: #0066ff;
  outline: none;
}

.form-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #0066ff;
  flex-shrink: 0;
}

.form-group.checkbox-group input[type="checkbox"] {
  width: 24px;
  height: 24px;
}

.submit-button {
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Écran de soumission */
.submitted-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0a0a0a;
}

.submitted-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
  text-align: center;
  gap: 1.5rem;
}

.success-icon {
  font-size: 4rem;
  animation: bounce 0.6s ease-out;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #0066ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066ff;
  background-color: rgba(0, 102, 255, 0.1);
  font-weight: bold;
}

.success-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #ffffff;
}

.success-message {
  font-size: 1.1rem;
  color: #d1d1d1;
  max-width: 500px;
  font-weight: 500;
}

.success-subtitle {
  font-size: 0.95rem;
  color: #999999;
  max-width: 500px;
  line-height: 1.6;
}

.back-home-button {
  display: inline-block;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.back-home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
}

/* Messages d'erreur */
.error-message {
  font-size: 0.95rem;
  color: #f87171;
  background-color: rgba(248, 113, 113, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 3px solid #f87171;
  max-width: 600px;
  text-align: left;
}

/* Animations */
@keyframes bounce {
  0% {
    transform: scale(0) translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .intro-content {
    padding: 1.5rem 1rem;
  }

  .intro-info {
    gap: 1rem;
  }

  .start-button {
    min-width: auto;
  }

  .quiz-content {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
  }

  .navigation-buttons {
    gap: 0.75rem;
  }

  .answer-card {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }

  .personal-info-content {
    padding: 1.5rem 1rem;
  }

  .personal-info-form {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .quiz-header {
    padding: 0.5rem 1rem;
    gap: 0.75rem;
  }

  .quiz-content {
    padding: 1rem;
  }

  .answer-card {
    padding: 0.9rem 1rem;
    gap: 0.75rem;
  }

  .answer-icon {
    width: 20px;
    height: 20px;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .nav-button {
    min-width: 100%;
  }

  .intro-title {
    line-height: 1.1;
  }

  .success-icon {
    font-size: 3rem;
  }
}
</style>