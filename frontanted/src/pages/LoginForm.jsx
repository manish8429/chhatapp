import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginUser } from "@/api/authService";
import { Link } from "react-router-dom";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      toast.success("Login Successful! 🎉");
      console.log(response.token);
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
    } catch (error) {
      toast.error(error.message || "Login Failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded-lg shadow-xl bg-white space-y-6">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold mt-3">Welcome Back</h2>
        <p className="text-gray-600 text-center">Enter your credentials to log in.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} placeholder="Enter your email" className="p-3" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" {...register("password")} placeholder="Enter your password" className="p-3" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="font-normal text-muted-foreground">
              Remember me
            </Label>
          </div>
          <a className="text-sm underline hover:no-underline" href="#">
            Forgot password?
          </a>
        </div>
        <Button type="submit" className="w-full bg-black text-white py-3 rounded-lg" disabled={loading}>
          {loading ? "Please wait..." : "Log In"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
