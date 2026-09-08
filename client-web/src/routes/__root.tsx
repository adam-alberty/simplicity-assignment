import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import { AppSidebar } from "#/components/sidebar";

import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger />

            <Outlet />
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "TanStack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
