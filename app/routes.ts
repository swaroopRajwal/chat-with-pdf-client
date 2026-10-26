import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/chatLayout.tsx", [
    route("chat/new", "routes/chatNew.tsx"),
    route("chat/:chat_id", "routes/chat.tsx"),
  ]),
] satisfies RouteConfig;
