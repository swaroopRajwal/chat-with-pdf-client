import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("ask/:file_id", "routes/ask.tsx")] satisfies RouteConfig;
