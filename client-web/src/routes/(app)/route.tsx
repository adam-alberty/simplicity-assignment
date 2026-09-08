import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "#/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/(app)")({ component: AppLayout });

function AppLayout() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full p-5">
					<SidebarTrigger />

					<div className="w-full container mx-auto">
						<Outlet />
					</div>
				</main>
			</SidebarProvider>
		</TooltipProvider>
	);
}
