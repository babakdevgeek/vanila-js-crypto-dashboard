export default function create_element(name, cls, attributes, content, childrens) {
    if (!name) {
        throw new Error("no element name passed to function");
    }

    const el = document.createElement(name);
    if (cls) {
        el.classList.add(...cls);
    }

    if (attributes) {
        Object.entries(attributes).forEach(([KeyboardEvent, value]) => {
            el.setAttribute(KeyboardEvent, value);
        })
    }

    if (content) {
        el.appendChild(document.createTextNode(content));
    }

    if (childrens && childrens.length > 0) {
        el.append(...childrens)
    }

    return el;
}