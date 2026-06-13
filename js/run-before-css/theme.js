(function () {
    const user_device_theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const theme = localStorage.getItem("THEME");
    console.log(user_device_theme);

    if (!theme) {
        if (user_device_theme === "light") {
            return;
        } else {
            document.documentElement.classList.add("dark");
        }
    }
    if (theme) {
        theme === "light" ? document.documentElement.classList.remove("dark") : document.documentElement.classList.add("dark");
    }
})()