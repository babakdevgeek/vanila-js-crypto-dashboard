import create_element from "../custom-functions/create_element.js";

export default function about(params) {
    document.title = "درباره ی ما"
    const el_about = create_element({ tag: "custom-about" });
    return el_about;
}