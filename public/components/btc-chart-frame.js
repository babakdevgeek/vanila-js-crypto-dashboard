import get_theme from "../custom-functions/theme.js";

export default class BtcChartFrame extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });
    }


    connectedCallback() {

        this.render();

        this.syncInitialTheme();

        this.listenThemeChanges();

    }



    render() {

        this.shadowRoot.innerHTML = `

        <style>

            :host {

                display:block;

                width:100%;

                height:700px;

            }


            iframe {

                width:100%;

                height:100%;

                border:0;

            }

        </style>


        <iframe
            id="chart"
            src="https://btc-live-chart.bobandcomputers.workers.dev">
        </iframe>

        `;


        this.iframe =
            this.shadowRoot.querySelector(
                "#chart"
            );

    }



    syncInitialTheme() {


        this.iframe.addEventListener(
            "load",
            ()=>{


                const theme =
                    get_theme();


                this.sendTheme(theme);


            }
        );


    }



    listenThemeChanges() {


        window.addEventListener(
            "theme-change",
            ()=>{


                const theme =
                    get_theme();


                this.sendTheme(theme);


            }
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


}


