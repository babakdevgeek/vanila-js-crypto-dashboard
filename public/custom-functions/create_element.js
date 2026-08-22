export default function create_element({ tag, id, class_names, text, childrens, attach, attrs, style }) {
    let el;
    if (!tag) {
        el = document.createElement("div");
        return el;
    }
    if (tag) {
        el = document.createElement(tag);
    }

    if (id) {
        el.id = id;
    }

    if (Array.isArray(class_names) && class_names.length > 0) {
        el.classList.add(...class_names);
    }

    if (text) {

        el.textContent = text;
    }
    if (Array.isArray(childrens) && childrens.length > 0) {
        el.append(...childrens);
    }
    if (attach instanceof HTMLElement && !el.isConnected) {
        attach.append(el)
    }

    if (style && Object.keys(style).length > 0) {
        Object.entries(style).forEach(([key, value]) => {
            el.style[key] = value
        })
    }

    if (attrs && Object.keys(attrs).length > 0) {
        Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value)
        })
    }
    return el;
}