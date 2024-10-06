import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home'
import SignUp from './Components/SignUp/SignUp'
import './index.css';
import HomeNavbar from './Components/Navbar/HomeNavbar'
import SignUpNavbar from './Components/Navbar/SignUpNavbar';

function App() {
  const location = useLocation();

  // Function to determine which navbar to render
  const renderNavbar = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
      case '/about':
        return <HomeNavbar />;
      case '/profile':
      case '/settings':
      case '/orders':
        return <SignUpNavbar />;
      default:
        return <SignUpNavbar />;
    }
  };

  return (
    <>
    <div className="App">
    {renderNavbar()}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
