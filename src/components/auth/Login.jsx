import React, { useState } from 'react'
import { loginUser as loginUserApi } from '../../../api/auth'
import { login } from '../../store/authSlice'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from "lucide-react";

function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const LoginUser = async (data) => {
        setError("");
        setIsLoading(true);

        try {

            const user = await loginUserApi(data)

            console.log(user);

            const userData = user?.data;

            console.log(userData)

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
    }

    return (
    <div
        className='
            min-h-screen

            bg-white text-black

            dark:bg-black
            dark:text-white

            flex items-center justify-center
            px-6

            transition
        '
    >

        <button
            onClick={() => navigate("/")}
            className='
                absolute top-8 left-8

                flex items-center gap-2

                text-zinc-600
                hover:text-black

                dark:text-zinc-400
                dark:hover:text-white

                transition
            '
        >
            <ArrowLeft size={20} />
            Back
        </button>

        <div
            className='
                w-full max-w-md

                rounded-3xl p-8 shadow-2xl border

                bg-zinc-100 border-zinc-200

                dark:bg-zinc-900
                dark:border-zinc-800

                transition
            '
        >

            <div className='text-center mb-8'>

                <h1 className='text-4xl font-bold'>
                    Welcome Back
                </h1>

            </div>

            <form
                onSubmit={handleSubmit(LoginUser)}
                className='space-y-5'
            >

                {error && (
                    <p
                        className='
                            bg-red-500/10
                            border border-red-500
                            text-red-400

                            px-4 py-3
                            rounded-xl
                            text-sm
                        '
                    >
                        {error}
                    </p>
                )}

                <div>

                    <input
                        type="text"
                        placeholder='Enter your email'
                        className='
                            w-full

                            rounded-2xl
                            px-5 py-4
                            outline-none border

                            bg-white
                            border-zinc-300
                            text-black

                            focus:border-black

                            dark:bg-zinc-800
                            dark:border-zinc-700
                            dark:text-white
                            dark:focus:border-white

                            transition
                        '
                        {...register("email", {
                            required: "email is required"
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
                        placeholder='Enter your password'
                        className='
                            w-full

                            rounded-2xl
                            px-5 py-4
                            outline-none border

                            bg-white
                            border-zinc-300
                            text-black

                            focus:border-black

                            dark:bg-zinc-800
                            dark:border-zinc-700
                            dark:text-white
                            dark:focus:border-white

                            transition
                        '
                        {...register("password", {
                            required: "password is required"
                        })}
                    />

                    {errors.password && (
                        <p className='text-red-400 text-sm mt-2'>
                            {errors.password.message}
                        </p>
                    )}

                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className='
                        w-full py-4 rounded-2xl
                        font-semibold

                        bg-black text-white

                        hover:scale-[1.02]

                        dark:bg-white
                        dark:text-black

                        transition
                        disabled:opacity-70
                    '
                >
                    {isLoading ? "Loading..." : "Login"}
                </button>

            </form>

            <p
                className='
                    text-center mt-8

                    text-zinc-600

                    dark:text-zinc-400
                '
            >

                Don't have an account?{" "}

                <Link
                    to="/signup"
                    className='
                        font-semibold

                        text-black
                        hover:underline

                        dark:text-white
                    '
                >
                    Sign Up
                </Link>

            </p>

        </div>

    </div>
)
}

export default Login