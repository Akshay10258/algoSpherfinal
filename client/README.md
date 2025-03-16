# Loan Advisor Chatbot

A conversational AI chatbot that helps users with loan-related queries, eligibility checks, EMI calculations, and more.

## Features

- User authentication (login/signup)
- Loan eligibility check
- EMI calculator
- FAQs about loans
- Voice input using Sarvam AI speech-to-text API
- Responsive design for all device sizes

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Sarvam API key:
     ```
     VITE_SARVAM_API_KEY=your_sarvam_api_key_here
     ```
   - You can obtain a Sarvam API key by signing up at [Sarvam AI](https://sarvam.ai)

4. Start the development server:
   ```
   npm run dev
   ```

## Voice Input Setup

This application uses the Sarvam AI API for speech-to-text functionality. To use this feature:

1. Sign up for an account at [Sarvam AI](https://sarvam.ai)
2. Generate an API key from your dashboard
3. Add the API key to your `.env` file as shown above
4. Restart the development server

The voice input feature supports both English and Hindi languages, automatically detecting based on the user's selected language in the app.

## Technologies Used

- React.js
- Tailwind CSS
- React Router
- Axios
- Sarvam AI API for speech-to-text

## Development

To build for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
