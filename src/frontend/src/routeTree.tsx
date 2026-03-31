import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import ToolPage from "./pages/ToolPage";

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/$toolId",
  component: ToolPage,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  galleryRoute,
  toolRoute,
]);
