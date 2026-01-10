import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import GoogleAuth from "../../components/SharedComponent/GoogleAuth"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "@/redux/user/userSlice";


import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// ✅ Validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const SignInForm = () => {
 
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation();

  const {loading, error: errorMessage} = useSelector((state) => state.user)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Signin handler
   async function onSubmit(values) {
  
    try {
    dispatch(signInStart());

    // ✅ FULL backend URL likho
    const res = await axios.post("http://localhost:5000/api/auth/sign-in", values, {
      withCredentials: true,
     
    });
     

    dispatch(signInSuccess({ user: res.data.user, token: res.data.token}))

    localStorage.setItem("user",JSON.stringify({ user: res.data.user, token: res.data.token}))
    console.log("token saved")

    // ✅ Ensure res and res.data exist
    if (!res || !res.data) {
      throw new Error("No response data received from server");
    }
    toast.success(res.data.message || "Signin successful! Welcome back.");
    const redirectPath = location.state?.from || "/";
    navigate(redirectPath);

  } catch (error) {
    console.error("Sign-in error (caught):", error);

    // ✅ Safely handle any type of error
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Sign-in failed! Try again.";

    dispatch(signInFailure(errorMsg));
    toast.error(errorMsg);
  }
}

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl sm:max-w-5xl mx-auto md:flex-row items-center gap-5">
        {/* Left Side */}
        <div className="flex-1 text-center mb-6">
          <Link to="/" className="font-bold text-2xl sm:text-4xl flex flex-wrap">
            <span className="text-slate-500">Morning</span>
            <span className="text-slate-900">Dispatch</span>
          </Link>
           
          <h2 className="text-[24px] md:text-[30px] font-bold leading-[140%] tracking-tighter pt-10 flex flex-wrap">
            Sign in to your account
          </h2>

         <p className="text-slate-500 text-[14px] md:text-[16px] pt-2 flex flex-wrap">
            Welcome back, please provide your details.
          </p>
        </div>
          
        {/* Right Side */}
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="abc@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="bg-blue-500 w-full">
                {loading ? "Signing in..." : "Submit"}
              </Button>

              <GoogleAuth />
              
            </form>
          </Form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">Sign Up</Link>
          </div>

          {errorMessage && <p className="mt-5 text-red-500">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignInForm;