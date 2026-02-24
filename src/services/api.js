const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const newsletterService = {
  async subscribe(email, firstName) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({
          email,
          firstName
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'inscription')
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur réseau. Veuillez réessayer.'
      }
    }
  }
}


