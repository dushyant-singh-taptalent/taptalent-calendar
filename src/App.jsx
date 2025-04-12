import { Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import BookingPage from './components/BookingPage';
import DemoBookingPage from './components/DemoBookingPage';
import './App.css';

function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/:profileName" element={<BookingPage />} />
        <Route path="/" element={<DemoBookingPage />} />
        <Route path="*" element={<DemoBookingPage />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
