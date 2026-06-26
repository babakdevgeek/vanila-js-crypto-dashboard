import create_element from "../custom-functions/create_element.js";
import { router } from "../index.js";

export default class CustomTable extends HTMLElement {
    constructor() {
        super();
        this.is_loading = true;
        this.on_table_row_click = this.on_table_row_click.bind(this);
    }

    turn_off_loading() {
        this.is_loading = false;
        this.el_wrapper.classList.remove("skeleton")
    }


    on_table_row_click(event, page) {
        const tr = event.target.closest("tr");
        const id = tr.dataset.id
        if (id) {
            router.push(`/${page}/${id}`);
        }
    }



    connectedCallback() {
        this.el_thead = create_element({ tag: "thead" });
        this.el_body = create_element({ tag: "tbody" });
        this.el_table = create_element({
            tag: "table", childrens: [
                this.el_thead,
                this.el_body
            ]
        })
        this.el_wrapper = create_element({
            tag: "div", class_names: ["table-wrapper"], childrens: [
                this.el_table
            ]
        })

        this.appendChild(this.el_wrapper);
        if (this.is_loading) {
            this.el_wrapper.classList.add("skeleton")
        }
    }

    disconnectedCallback() {

    }
}


