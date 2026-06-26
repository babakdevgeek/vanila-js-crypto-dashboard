import create_element from "../custom-functions/create_element.js";

export default function home(params) {
    document.title = "YOUR USER HELPER"
    const container = create_element({ tag: "div" });

    const table_widget = create_element({ tag: "custom-table-widget" });
    container.append(table_widget);
    return container;
}