import { createRootRoute, createRoute } from "@tanstack/react-router";
import { lazy } from "react";
import { RootComponent } from "./routes/__root";
import { IndexPage } from "./routes/index";

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/",         component: IndexPage });
const omRoute       = createRoute({ getParentRoute: () => rootRoute, path: "/om",       component: lazy(() => import("./routes/om").then(m => ({ default: m.OmPage }))) });

const featuredRoute = createRoute({ getParentRoute: () => rootRoute, path: "/featured", component: lazy(() => import("./routes/featured").then(m => ({ default: m.FeaturedPage }))) });
const legalRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/legal",    component: lazy(() => import("./routes/legal").then(m => ({ default: m.LegalPage }))) });
const adminRoute    = createRoute({ getParentRoute: () => rootRoute, path: "/admin",    component: lazy(() => import("./routes/admin").then(m => ({ default: m.AdminPage }))) });


export const routeTree = rootRoute.addChildren([
  indexRoute,
  omRoute,

  featuredRoute,
  legalRoute,
  adminRoute,

]);
