import React, { useState } from 'react'

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../store/authSlice";

import { logoutUser } from '../../../api/auth';

import { useNavigate } from 'react-router-dom';

import ThemeButton from "./ThemeButton";

import { Menu, X } from "lucide-react";

function Navbar() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const { status, userData } = useSelector(
        (state) => state.auth
    );

    const handleLogout = async () => {

        try {

            await logoutUser();

            dispatch(logout());

            navigate("/login");

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <nav
            className='
                sticky top-0 z-50

                bg-white text-black border-b border-zinc-200

                dark:bg-black
                dark:text-white
                dark:border-zinc-800

                transition
            '
        >

            <div className='max-w-7xl mx-auto px-6 py-4'>

                <div className='flex items-center justify-between'>

                    {/* Logo */}

                    <h1
                        onClick={() => navigate("/")}
                        className='
                            text-2xl font-bold tracking-wide
                            cursor-pointer
                        '
                    >
                        Baat Karo
                    </h1>

                    {/* Desktop Menu */}

                    <div className='hidden md:flex items-center gap-4'>

                        <ThemeButton />

                        {status ? (
                            <>

                                <button
                                    className='
                                        px-5 py-2 rounded-xl

                                        bg-zinc-200
                                        hover:bg-zinc-300

                                        dark:bg-zinc-900
                                        dark:hover:bg-zinc-800

                                        transition
                                    '
                                >
                                    {userData?.username}
                                </button>

                                <button
                                    className='
                                        px-5 py-2 rounded-xl font-semibold

                                        bg-black text-white

                                        dark:bg-white
                                        dark:text-black

                                        hover:scale-105
                                        transition
                                    '
                                >
                                    Open Chat
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className='
                                        px-5 py-2 rounded-xl

                                        bg-red-500 text-white
                                        hover:bg-red-600

                                        transition
                                    '
                                >
                                    Logout
                                </button>

                            </>
                        ) : (
                            <>

                                <button
                                    className='
                                        px-5 py-2 rounded-xl

                                        bg-zinc-200
                                        hover:bg-zinc-300

                                        dark:bg-zinc-900
                                        dark:hover:bg-zinc-800

                                        transition
                                    '
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>

                                <button
                                    className='
                                        px-5 py-2 rounded-xl font-semibold

                                        bg-black text-white

                                        dark:bg-white
                                        dark:text-black

                                        hover:scale-105
                                        transition
                                    '
                                    onClick={() => navigate("/signup")}
                                >
                                    SignUp
                                </button>

                            </>
                        )}

                    </div>

                    {/* Mobile Menu Button */}

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className='md:hidden'
                    >

                        {menuOpen ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}

                    </button>

                </div>

                {/* Mobile Menu */}

                {menuOpen && (

                    <div
                        className='
                            md:hidden
                            flex flex-col gap-4
                            mt-6 pb-4
                        '
                    >

                        <ThemeButton />

                        {status ? (
                            <>

                                <button
                                    className='
                                        w-full px-5 py-3 rounded-xl

                                        bg-zinc-200
                                        hover:bg-zinc-300

                                        dark:bg-zinc-900
                                        dark:hover:bg-zinc-800

                                        transition
                                    '
                                >
                                    {userData?.username}
                                </button>

                                <button
                                    className='
                                        w-full px-5 py-3 rounded-xl font-semibold

                                        bg-black text-white

                                        dark:bg-white
                                        dark:text-black

                                        transition
                                    '
                                >
                                    Open Chat
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className='
                                        w-full px-5 py-3 rounded-xl

                                        bg-red-500 text-white
                                        hover:bg-red-600

                                        transition
                                    '
                                >
                                    Logout
                                </button>

                            </>
                        ) : (
                            <>

                                <button
                                    className='
                                        w-full px-5 py-3 rounded-xl

                                        bg-zinc-200
                                        hover:bg-zinc-300

                                        dark:bg-zinc-900
                                        dark:hover:bg-zinc-800

                                        transition
                                    '
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>

                                <button
                                    className='
                                        w-full px-5 py-3 rounded-xl font-semibold

                                        bg-black text-white

                                        dark:bg-white
                                        dark:text-black

                                        transition
                                    '
                                    onClick={() => navigate("/signup")}
                                >
                                    SignUp
                                </button>

                            </>
                        )}

                    </div>

                )}

            </div>

        </nav>
    )
}

export default Navbar