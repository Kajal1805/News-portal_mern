import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebase';
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { signInSuccess } from '../../redux/user/userSlice'; // make sure this path is right

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const firebaseResponse = await signInWithPopup(auth, provider);

      // ✅ Extract user data from Firebase
      const name = firebaseResponse.user.displayName;
      const email = firebaseResponse.user.email;
      const profilePicture = firebaseResponse.user.photoURL;

      // ✅ Send data properly to backend
      const res = await axios.post("api/auth/google", {
        name,
        email,
        profilePicture,
      });
      

      // ✅ Handle successful login
      if (res.data) {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }

    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="bg-green-500 w-full"
        onClick={handleGoogleClick}
      >
        Sign in with Google
      </Button>
    </div>
  );
  
};


export default GoogleAuth;