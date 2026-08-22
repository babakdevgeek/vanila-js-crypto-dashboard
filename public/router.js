import not_found from "./page-components/not-found.js";

export default class Router {
    constructor(routes) {
        this.routes = routes;

        window.addEventListener("popstate", () => {

            this.resolve();
        })
        this.resolve()
    }

    push(path) {
        history.pushState({}, "", path);
        this.resolve();
    }

    match_route(path) {
        for (const route of this.routes) {
            const params = this.extract_params(route.path, path);
            if (params) {
                return { route, params };
            }
        }
        return null;
    }

    extract_params(route_path, current_path) {
        const route_parts = route_path.split("/");
        const path_parts = current_path.split("/");
        if (route_parts.length !== path_parts.length) return null;

        const params = {};
        for (let i = 0; i < route_parts.length; i++) {
            const r = route_parts[i];
            const p = path_parts[i];

            if (r.startsWith(":")) {
                params[r.slice(1)] = p;
            } else if (r !== p) {
                return null;
            }

        }
        return params;
    }

    resolve() {
        const path = window.location.pathname;

        const match = this.match_route(path);

        const view = match
            ? match.route.component(match.params)
            : not_found();

        const router_view = document.querySelector("router-view");
        router_view.innerHTML = "";
        router_view.appendChild(view);
    }
}