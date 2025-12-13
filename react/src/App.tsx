import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Login from "./pages/Login"
import ApiDemo from "./pages/ApiDemo"
import Register from "./pages/Register"
import User from "./pages/User/User"
import UpdateUser from "./pages/User/UpdateUser"
import Navbar from "./components/Navbar"
import CreatePost from "./pages/Posts/CreatePost"
import Posts from "./pages/Posts/Posts"
import UpdatePost from "./pages/Posts/UpdatePost"
import ToastContainer from "./components/ToastContainer"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo" element={<ApiDemo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User />} />
            <Route path="/update-profile" element={<UpdateUser />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/edit-post/:id" element={<UpdatePost />} />
          </Routes>
        </main>

        <ToastContainer position="top-right" />
      </div>
    </Router>
  )
}
