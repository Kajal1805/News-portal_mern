import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { signup } from "@/api/api";




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
import  GoogleAuth  from "@/components/SharedComponent/GoogleAuth";
import { signInSuccess } from "@/redux/user/userSlice";
import { useDispatch } from "react-redux";




// ✅ Validation schema
const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  // ✅ Signup handler
   async function onSubmit(values) {
  try {
    setLoading(true);

   const res = await axios.post("/api/auth/signup", values, {
    withCredentials: true,
    headers: { "Content-Type":"application/json" },
   });

   const data = res.data;
   if(data.success && data.user) {
    dispatch(signInSuccess(data.user));

    
   }

    // ✅ Success toast
    toast.success(res.data?.message ||"Signup successful! Your account has been created.");
    navigate("/sign-in");

    
  } catch (error) {
    console.error("Signup error:", error);

    // ✅ Network error toast
    if (error.code === "ERR_NETWORK") {
      toast.error("Server not responding! Please make sure backend is running.");
    } else {
      toast.error(error.response?.data?.message || "Signup failed! Try again.");
    }
  } finally {
    setLoading(false);
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
            Create a new account
          </h2>

          <p className="text-slate-500 text-[14px] md:text-[16px] pt-2 flex flex-wrap">
            Welcome to Morning Dispatch, please provide your details.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                {loading ? "Signing up..." : "Submit"}
              </Button>

              <GoogleAuth />
             
            </form>
          </Form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;