import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import DrugResistancePage from "./pages/DrugResistancePage";
import HomePage from "./pages/HomePage";
import PatientPage from "./pages/PatientPage";
import QuestionnairePage from "./pages/QuestionnairePage";

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
const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient",
  component: PatientPage,
});
const questionnaireRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/questionnaire",
  component: QuestionnairePage,
});
const resistanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resistance",
  component: DrugResistancePage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  patientRoute,
  questionnaireRoute,
  resistanceRoute,
  contactRoute,
  adminRoute,
]);
