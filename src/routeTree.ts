import { createRootRoute, createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { RootComponent } from "./routes/__root";
import { IndexPage } from "./routes/index";

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/",         component: IndexPage });
const omRoute       = createRoute({ getParentRoute: () => rootRoute, path: "/om",       component: lazy(() => import("./routes/om").then(m => ({ default: m.OmPage }))) });
const akustikkRoute = createRoute({ getParentRoute: () => rootRoute, path: "/akustikk", component: lazy(() => import("./routes/akustikk").then(m => ({ default: m.AkustikkPage }))) });
const featuredRoute = createRoute({ getParentRoute: () => rootRoute, path: "/featured", component: lazy(() => import("./routes/featured").then(m => ({ default: m.FeaturedPage }))) });
const adminRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/admin",    component: lazy(() => import("./routes/admin").then(m => ({ default: m.AdminPage }))) });
const beatsRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/beats",    component: lazy(() => import("./routes/beats").then(m => ({ default: m.BeatsPage }))) });

export const routeTree = rootRoute.addChildren([
  indexRoute,
  omRoute,
  akustikkRoute,
  featuredRoute,
  adminRoute,
  beatsRoute,
]);
