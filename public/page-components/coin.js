import create_element from "../custom-functions/create_element.js";

export default function ({ id }) {
    return create_element({ tag: "custom-coin-widget", attrs: { coin: id } });
}