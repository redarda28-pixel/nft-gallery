import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import DetailPage from "@/pages/DetailPage";
import GalleryPage from "@/pages/GalleryPage";
import MintPage from "@/pages/MintPage";
import MyNFTsPage from "@/pages/MyNFTsPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster position="bottom-right" richColors />
    </Layout>
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GalleryPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: DetailPage,
});

const mintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mint",
  component: MintPage,
});

const myNFTsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-nfts",
  component: MyNFTsPage,
});

const routeTree = rootRoute.addChildren([
  galleryRoute,
  detailRoute,
  mintRoute,
  myNFTsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
