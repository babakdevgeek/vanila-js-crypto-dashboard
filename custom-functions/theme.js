export default function get_theme() {
    return localStorage.getItem("THEME") ?? "light"
}