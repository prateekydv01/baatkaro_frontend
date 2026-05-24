// src/components/home/ContentLoggedOut.jsx

import React from "react";

import { Link } from "react-router-dom";

function ContentLoggedOut() {

    const features = [
        {
            title: "Real-Time Chat",
            description:
                "Connect instantly with people using fast messaging.",
            icon: "💬",
        },
        {
            title: "Connection Requests",
            description:
                "Send and manage requests seamlessly.",
            icon: "🤝",
        },
        {
            title: "Online Presence",
            description:
                "See who is online in real-time.",
            icon: "🟢",
        },
    ];

    return (

        <div className='max-w-7xl mx-auto px-6 py-16'>

            {/* Hero */}

            <div
                className='
                    grid lg:grid-cols-2
                    gap-16 items-center
                '
            >

                {/* Left */}

                <div>

                    <p
                        className='
                            uppercase tracking-[0.3em]
                            text-sm

                            text-zinc-500
                            dark:text-zinc-400
                        '
                    >
                        Real-Time Social Platform
                    </p>

                    <h1
                        className='
                            text-5xl md:text-6xl
                            font-bold leading-tight
                            mt-6
                        '
                    >
                        Build Meaningful Connections Online
                    </h1>

                    <p
                        className='
                            mt-8 text-lg leading-relaxed

                            text-zinc-700
                            dark:text-zinc-400
                        '
                    >
                        Chat instantly, connect with people,
                        and build your own real-time network.
                    </p>

                    <div className='flex gap-5 flex-wrap mt-10'>

                        <Link
                            to="/signup"
                            className='
                                px-8 py-4 rounded-2xl
                                font-semibold

                                bg-black text-white

                                dark:bg-white
                                dark:text-black

                                hover:scale-105
                                transition
                            '
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/login"
                            className='
                                px-8 py-4 rounded-2xl
                                border

                                border-zinc-300
                                hover:bg-zinc-100

                                dark:border-zinc-700
                                dark:hover:bg-zinc-900

                                transition
                            '
                        >
                            Login
                        </Link>

                    </div>

                </div>

                {/* Right */}

                <div
                    className='
                        rounded-3xl p-8 border shadow-2xl

                        bg-zinc-100 border-zinc-200

                        dark:bg-zinc-900
                        dark:border-zinc-800
                    '
                >

                    <div className='space-y-5'>

                        <div
                            className='
                                p-5 rounded-2xl

                                bg-white

                                dark:bg-zinc-800
                            '
                        >
                            <p className='font-semibold'>
                                Rahul sent you a request
                            </p>

                            <p
                                className='
                                    text-sm mt-1

                                    text-zinc-500
                                '
                            >
                                2 min ago
                            </p>
                        </div>

                        <div
                            className='
                                p-5 rounded-2xl

                                bg-white

                                dark:bg-zinc-800
                            '
                        >
                            <p className='font-semibold'>
                                Aman is online
                            </p>

                            <p
                                className='
                                    text-sm mt-1 text-green-500
                                '
                            >
                                Active now
                            </p>
                        </div>

                        <div
                            className='
                                p-5 rounded-2xl

                                bg-white

                                dark:bg-zinc-800
                            '
                        >
                            <p className='font-semibold'>
                                New Message
                            </p>

                            <p
                                className='
                                    text-sm mt-1

                                    text-zinc-500
                                '
                            >
                                “Hey, let's connect!”
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Features */}

            <div className='grid md:grid-cols-3 gap-8 mt-24'>

                {features.map((feature, index) => (

                    <div
                        key={index}
                        className='
                            p-8 rounded-3xl border

                            bg-zinc-100 border-zinc-200

                            dark:bg-zinc-900
                            dark:border-zinc-800

                            hover:-translate-y-2
                            transition
                        '
                    >

                        <div className='text-5xl mb-5'>
                            {feature.icon}
                        </div>

                        <h2 className='text-2xl font-bold'>
                            {feature.title}
                        </h2>

                        <p
                            className='
                                mt-4 leading-relaxed

                                text-zinc-600

                                dark:text-zinc-400
                            '
                        >
                            {feature.description}
                        </p>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default ContentLoggedOut;