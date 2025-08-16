import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    react()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'donor': [
            './src/components/donor/DonorDashboard.jsx',
            './src/components/donor/DonorProfile.jsx',
            './src/components/donor/Donations.jsx',
            './src/components/donor/EligibilityChecker.jsx'
          ],
          'hospital': ['./src/components/hospital/BloodRequestManagement.jsx'],
          'patient': ['./src/components/patient/DiseaseStyled.jsx'],
          'landing': ['./src/components/Landing/Eligibility.jsx']
        }
      }
    }
  }
})
