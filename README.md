# TapTalent Schedule Booking

This project provides a schedule booking application that integrates with the Aurinko API for calendar scheduling and a custom backend API for storing booking information.

## Setup

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Run the development server with `pnpm dev`

## Environment Variables

The application uses the following environment variables:

- `VITE_APP_ENV`: Set to `development`, `staging`, or `prod` to determine which backend to use
- `VITE_CLIENT_ID`: Your Aurinko API client ID

## API Integration

The application integrates with two APIs:

1. **Aurinko API**: Used for calendar scheduling
2. **Backend API**: Used for storing booking information

When a user makes a booking, the application:
1. Calls the Aurinko API to schedule the meeting
2. Calls the backend API to store the booking information

## Technology Stack

- React
- Vite
- MUI (Material-UI)
- Mantine
- Axios

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
