import { createRootRoute, createRoute, createRouter as _createRouter } from "@tanstack/react-router";
import { RootComponent } from "./routes/__root";
import { IndexPage } from "./routes/index";
import { OmPage } from "./routes/om";
import { AkustikkPage } from "./routes/akustikk";
import { FeaturedPage } from "./routes/featured";
import { AdminPage } from "./routes/admin";

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: IndexPage });
const omRoute = createRoute({ getParentRoute: () => rootRoute, path: "/om", component: OmPage });
const akustikkRoute = createRoute({ getParentRoute: () => rootRoute, path: "/akustikk", component: AkustikkPage });
const featuredRoute = createRoute({ getParentRoute: () => rootRoute, path: "/featured", component: FeaturedPage });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: "/admin", component: AdminPage });

export const routeTree = rootRoute.addChildren([
  indexRoute,
  omRoute,
  akustikkRoute,
  featuredRoute,
  adminRoute,
]);
