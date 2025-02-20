import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signupUser } from "@/api/authService";
import { Link, useNavigate } from "react-router-dom";

const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  file: z.any().refine((file) => file?.length > 0, "Profile picture is required."),
});

export default function SignupForm() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.file[0]) formData.append("image", data.file[0]); // Append file

      const response = await signupUser(formData);
      toast.success("Signup Successful! 🎉");
      if (response.token) {
        localStorage.setItem("token", response.token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || "Signup Failed. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded-lg shadow-xl bg-white space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border p-2">
          <svg
            className="stroke-zinc-800 dark:stroke-zinc-100"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mt-3">Welcome back</h2>
        <p className="text-gray-600 text-center">Enter your credentials to sign up.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} placeholder="Enter your name" className="p-3" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
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
        <div>
          <Label>Upload Profile Picture</Label>
          <Input type="file" {...register("file")} className="p-3" />
          {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>}
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
          {loading ? "Please wait..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
