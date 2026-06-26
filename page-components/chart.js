import create_element from "../custom-functions/create_element.js";

export default function chart(params) {
    const container = create_element({ tag: "div" });
    const chart = create_element({ tag: "custom-t-chart" })

    container.appendChild(chart);
    return container;
}