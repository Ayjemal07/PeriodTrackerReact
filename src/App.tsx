import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import store from './redux/store';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Signup from './pages/Signup';
import PeriodTrackerPage from './pages/PeriodTrackerPage';
import Modal from 'react-modal'; // Import Modal component
import { AuthProvider } from './auth/UserAuth';

// Define the app element
const appElement = document.getElementById('root')!; // Use non-null assertion

// Set the app element for the modal
Modal.setAppElement(appElement);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Provider store={store}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/periodtracker" element={<PeriodTrackerPage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
