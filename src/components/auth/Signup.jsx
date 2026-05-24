import React, { useState } from 'react';
import { registerUser as registerUserApi } from "../../../api/auth.js";
import { Link, useNavigate } from 'react-router-dom';
import { login } from "../../store/authSlice.js";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';

function Signup() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const handleRegister = async (data) => {

        setError("");
        setIsLoading(true);

        try {

            const user = await registerUserApi(data);

            const userData = user?.data;

            if (userData) {

                dispatch(login({
                    userData: userData.user,
                    accessToken: userData.accessToken
                }));

                navigate("/");
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            );

        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div
        className='
            min-h-screen bg-white text-black dark:bg-black dark:text-white flex items-center justify-center px-6 transition'
    >

        <button
            onClick={() => navigate("/")}
            className=' absolute top-8 left-8 flex items-center gap-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition'
        >
            <ArrowLeft size={20} />
            Back
        </button>

        <div
            className='w-full max-w-md rounded-3xl p-8 shadow-2xl border bg-zinc-100 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition'
        >

            <div className='text-center mb-8'>

                <h1 className='text-4xl font-bold'>
                    Create Account
                </h1>

                <p className='mt-3 text-zinc-600 dark:text-zinc-400'>
                    Join and start connecting with people
                </p>

            </div>

            <form
                onSubmit={handleSubmit(handleRegister)}
                className='space-y-5'
            >

                {error && (
                    <p className=' bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm'>
                        {error}
                    </p>
                )}

                <div>

                    <input
                        type="text"
                        placeholder="Enter username"
                        className='w-full rounded-2xl px-5 py-4 outline-none border bg-white border-zinc-300 text-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-white transition'
                        {...register("username", {
                            required: "Username is required"
                        })}
                    />

                    {errors.username && (
                        <p className='text-red-400 text-sm mt-2'>
                            {errors.username.message}
                        </p>
                    )}

                </div>

                <div>

                    <input
                        type="email"
                        placeholder="Enter email"
                        className='w-full rounded-2xl px-5 py-4 outline-none border bg-white border-zinc-300 text-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-white transition'
                        {...register("email", {
                            required: "Email is required"
                        })}
                    />

                    {errors.email && (
                        <p className='text-red-400 text-sm mt-2'>
                            {errors.email.message}
                        </p>
                    )}

                </div>

                <div>

                    <input
                        type="password"
                        placeholder="Enter password"
                        className='w-full rounded-2xl px-5 py-4 outline-none border bg-white border-zinc-300 text-black focus:border-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:focus:border-white transition'
                        {...register("password", {
                            required: "Password is required",
                            minLength: {value: 6,message: "Password must be at least 6 characters"}
                        })}
                    />

                    {errors.password && (
                        <p className='text-red-400 text-sm mt-2'>
                            {errors.password.message}
                        </p>
                    )}

                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className='w-full py-4 rounded-2xl font-semibold bg-black text-white hover:scale-[1.02] dark:bg-white dark:text-black transition disabled:opacity-70'>
                    {isLoading ? "Loading..." : "Signup"}
                </button>

            </form>

            <p
                className='text-center mt-8 text-zinc-600 dark:text-zinc-400'>
                Already have an account?{" "}
                <Link
                    to="/login"
                    className='font-semibold text-black hover:underline dark:text-white'
                >
                    Login
                </Link>
            </p>
        </div>
    </div>
);
}

export default Signup;