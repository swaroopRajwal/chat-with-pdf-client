import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("ask/:file_id", "routes/ask.tsx"), route("chat/:file_id", "routes/chat.tsx")] satisfies RouteConfig;
