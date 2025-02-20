import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SignupForm from "./pages/SignupForm"; // Import the component
import LoginForm from "./pages/LoginForm";
// import UserList from "./pages/UserList";
import Chat from "./pages/Chat";

function App() {

  return (


    <Routes>
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Chat />} />
    </Routes>

  );
}

export default App;

// manishkp8422@gmail.com
