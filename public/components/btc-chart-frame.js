import get_theme from "../custom-functions/theme.js";


export default class BtcChartFrame extends HTMLElement {


    constructor() {

        super();

        this.attachShadow({
            mode: "open"
        });


        this.interactive = false;

    }




    connectedCallback() {

        this.render();

        this.syncInitialTheme();

        this.listenThemeChanges();

        this.setupInteraction();

    }





    render() {


        this.shadowRoot.innerHTML = `

        <style>


            :host {

                display:block;

                width:100%;

                height:400px;

            }



            .container {

                width:100%;

                height:100%;

                position:relative;

            }



            iframe {

                width:100%;

                height:100%;

                border:0;

                display:block;

                pointer-events:none;

            }



            iframe.active {

                pointer-events:auto;

            }



            .overlay {

                position:absolute;

                inset:0;

                z-index:5;

                cursor:pointer;

                display:flex;

                align-items:center;

                justify-content:center;

                background:transparent;

            }



            .message {

                padding:8px 14px;

                border-radius:8px;

                background:rgba(0,0,0,.45);

                color:white;

                font-size:13px;

                opacity:.8;

            }



            .exit {

                position:absolute;

                right:12px;

                top:12px;

                z-index:10;

                display:none;

                padding:6px 10px;

                border-radius:6px;

                border:0;

                cursor:pointer;

            }



            .exit.visible {

                display:block;

            }


        </style>




        <div class="container">


            <iframe

                id="chart"

                src="https://btc-live-chart.bobandcomputers.workers.dev">

            </iframe>



            <div 
                class="overlay"
                id="overlay"
            >

                <div class="message">

                   لمس کنید تا نمودار فعال شود

                </div>

            </div>



            <button
                class="exit"
                id="exit"
            >

                بستن حالت تعاملی

            </button>



        </div>

        `;



        this.iframe =
            this.shadowRoot.querySelector(
                "#chart"
            );


        this.overlay =
            this.shadowRoot.querySelector(
                "#overlay"
            );


        this.exitButton =
            this.shadowRoot.querySelector(
                "#exit"
            );


    }







    /*
     * ----------------------------------------
     * Theme synchronization
     * ----------------------------------------
     */


    syncInitialTheme() {


        this.iframe.addEventListener(
            "load",
            ()=>{


                this.sendTheme(
                    get_theme()
                );


            }
        );


    }






    listenThemeChanges() {


        this.themeListener = ()=>{


            this.sendTheme(
                get_theme()
            );


        };



        window.addEventListener(
            "theme-change",
            this.themeListener
        );


    }






    sendTheme(theme) {


        this.iframe.contentWindow.postMessage(

            {
                type:"theme-change",
                theme
            },

            "https://btc-live-chart.bobandcomputers.workers.dev"

        );


    }







    /*
     * ----------------------------------------
     * Interaction mode
     * ----------------------------------------
     */


    setupInteraction() {


        this.overlay.addEventListener(
            "click",
            ()=>{


                this.enableInteraction();


            }
        );



        this.exitButton.addEventListener(
            "click",
            ()=>{


                this.disableInteraction();


            }
        );


    }







    enableInteraction() {


        this.interactive = true;


        this.iframe.classList.add(
            "active"
        );


        this.overlay.style.display =
            "none";


        this.exitButton.classList.add(
            "visible"
        );


    }






    disableInteraction() {


        this.interactive = false;


        this.iframe.classList.remove(
            "active"
        );


        this.overlay.style.display =
            "flex";


        this.exitButton.classList.remove(
            "visible"
        );


    }







    disconnectedCallback() {


        window.removeEventListener(
            "theme-change",
            this.themeListener
        );


    }


}