import create_element from "../custom-functions/create_element.js";

export default function not_found(params) {
    document.title = "404";
    const not_found = create_element({ tag: "p", text: "صفحه مورد نظر یافت نشد." });
    return not_found;
}