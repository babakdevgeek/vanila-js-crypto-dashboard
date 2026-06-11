export default class Accordion {
    constructor() {
        this.el_accordion = document.querySelector(".accordion");
        console.log("accordion is ", this.el_accordion);

        this.el_accordion_title =
            this.el_accordion.querySelector(".accordion-title");
        this.el_accordion_body = this.el_accordion.querySelector(".accordion-body");
        this.el_accordion_title_icon =
            this.el_accordion_title.querySelector("span:last-of-type");

        this.init_listeners();
    }

    init_listeners() {
        this.el_accordion_title.addEventListener("click", () => {
            const display_state =
                this.el_accordion_body.style.display === "block" ? true : false;
            if (!display_state) {
                this.el_accordion_body.style.display = "block";
                this.el_accordion_title_icon.style.transform = "rotate(180deg)";
            }
            if (display_state) {
                this.el_accordion_body.style.display = "none";
                this.el_accordion_title_icon.style.transform = "rotate(0)";
            }
        });
    }

}