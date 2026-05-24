// src/components/home/ContentLoggedIn.jsx

import React from "react";

import { useSelector } from "react-redux";

function ContentLoggedIn() {

    const { userData } = useSelector(
        (state) => state.auth
    );

    const cards = [
        {
            title: "Connections",
            value: "120+",
            icon: "🤝",
        },
        {
            title: "Messages",
            value: "48",
            icon: "💬",
        },
        {
            title: "Online Friends",
            value: "18",
            icon: "🟢",
        },
    ];

    return (

        <div className='max-w-7xl mx-auto px-6 py-16'>

            {/* Welcome */}

            <div>

                <h1
                    className='
                        text-4xl md:text-6xl
                        font-bold
                    '

                >
                    Welcome, <span> </span>
                    {userData?.username}
                </h1>

                <p
                    className='
                        mt-6 text-lg

                        text-zinc-600

                        dark:text-zinc-400
                    '
                >
                    Continue your conversations and
                    build new connections.
                </p>

            </div>



        </div>
    );
}

export default ContentLoggedIn;