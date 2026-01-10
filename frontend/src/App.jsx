import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignInForm from './authentication/forms/SignInForm'
import SignUpForm from './authentication/forms/SignUpForm'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Newsarticle from './pages/Newsarticle'
import Header from './components/SharedComponent/Header'
import Footer from './components/SharedComponent/Footer'
import { Toaster } from  'react-hot-toast';
import PrivateRoute from './components/SharedComponent/PrivateRoute'
import CreatePost from './pages/CreatePost'
import AdminPrivateRoute from './components/SharedComponent/AdminPrivateRoute'
import SinglePost from "./pages/SinglePost";
import EditPost from './pages/EditPost'
import PostDetails from './pages/PostDetails'
import SrollTotop from './components/SharedComponent/SrollTotop'
import Search from './pages/Search'


const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <SrollTotop />
    <Routes>
      <Route path="/sign-in" element={<SignInForm />} />
      <Route path="/sign-up" element={<SignUpForm />} />

      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/search" element={<Search />} />

      <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} /> </Route>

      <Route element={<AdminPrivateRoute />}>
      <Route path="/create-post" element={<CreatePost />} /> </Route>
       <Route path="/update-post/:postId" element={<EditPost />} />

      <Route path="/Newsarticle" element={<Search />} /> 

      {/* <Route path="/post/:slug" element={<SinglePost />} /> */}
      <Route path="/post/:postSlug" element={<PostDetails />} />

     
    </Routes>

    <Footer />

     <Toaster position = "top.center" 
      toastOptions={{
        duration: 3000, 
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
       />
    
    </BrowserRouter>
  );
};

export default App;
