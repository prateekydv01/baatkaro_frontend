import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/themeSlice";

function ThemeButton() {

    const dispatch = useDispatch();

    const { theme } = useSelector(
        (state) => state.theme
    );

    return (

        <button
            onClick={() => dispatch(toggleTheme())}
            className='
                px-4 py-2 rounded-xl
                bg-zinc-200 text-black
                hover:bg-zinc-300

                dark:bg-zinc-800
                dark:text-white
                dark:hover:bg-zinc-700

                transition
            '
        >
            {theme === "dark"
                ? "☀️"
                : "🌙"}
        </button>

    );
}

export default ThemeButton;