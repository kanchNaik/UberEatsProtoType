import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home'
import SignUp from './Components/SignUp/SignUp'
import './index.css';
import HomeNavbar from './Components/Navbar/HomeNavbar'
import SignUpNavbar from './Components/Navbar/SignUpNavbar';
import SignIn from './Components/SignIn/SignIn'
import RestaurantSignUp from './Components/SignUp/RestaurantSignUp'
import Feed from './Components/Feed/Feed'
import FeedNavbar from './Components/Navbar/FeedNavbar'
import Restaurant from './Components/Restaurant/Restaurant'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const location = useLocation();

  // Function to determine which navbar to render
  const renderNavbar = () => {
    switch (location.pathname) {
      case '/':
      case '/home':
        return <HomeNavbar />;
      case '/signin':
      case '/signup':
        return <SignUpNavbar />;
      case '/feed':
        return <FeedNavbar/>
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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/merchantsignup" element={<RestaurantSignUp />} />
        <Route path="feed" element={<Feed/>} />
        <Route path="/restaurant/:id" element={<Restaurant/>} />
      </Routes>
    </div>
    </>
  );
}

export default App;
