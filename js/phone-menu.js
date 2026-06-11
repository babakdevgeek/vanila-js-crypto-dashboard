export default class PhoneMenu {
    constructor(id_menu_button, id_menu_back_button, id_phone_menu) {


        // Selecting the elements
        this.el_menu_button = document.getElementById(id_menu_button);
        this.el_menu_back_button = document.getElementById(id_menu_back_button);
        this.el_phone_menu = document.getElementById(id_phone_menu)
        console.log(this.el_menu_button);

        // Firing listeners 
        this.init_listeners();
    }

    init_listeners() {
        document.addEventListener("click", (event) => {
            if (!this.el_phone_menu.contains(event.target)) {
                this.el_phone_menu.classList.remove("show")
            }
        })
        this.el_menu_button.addEventListener("click", (e) => {
            e.stopPropagation();
            this.el_phone_menu.style.display = "block"
            setTimeout(() => {
                this.el_phone_menu.classList.add("show")
            }, 0);
        })

        this.el_menu_back_button.addEventListener("click", (e) => {
            e.stopPropagation();
            this.el_phone_menu.classList.remove("show")
        })
    }
}