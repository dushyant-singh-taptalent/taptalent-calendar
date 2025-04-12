import { Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { ThemeProvider, createTheme as createMuiTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BookingPage from './components/BookingPage';
import DemoBookingPage from './components/DemoBookingPage';
import './App.css';

// Create MUI theme with primary color #6E58FF
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#6E58FF',
    },
  },
});

// Create Mantine theme with primary color #6E58FF
const mantineTheme = createTheme({
  colors: {
    brand: ['#EDE9FF', '#DCD4FF', '#CAC0FF', '#B7ABFF', '#A597FF', '#9383FF', '#6E58FF', '#5A43FF', '#472FFF', '#331AFF'],
  },
  primaryColor: 'brand',
});

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <MantineProvider theme={mantineTheme}>
        <Routes>
          <Route path="/:profileName" element={<BookingPage />} />
          <Route path="/" element={<DemoBookingPage />} />
          <Route path="*" element={<DemoBookingPage />} />
        </Routes>
      </MantineProvider>
    </ThemeProvider>
  );
}

export default App;
