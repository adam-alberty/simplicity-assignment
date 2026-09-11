import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar } from "#/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createFileRoute("/(app)")({ component: AppLayout });

function askNotificationPermission() {
	if (!("Notification" in window)) {
		console.log("This browser does not support notifications.");
		return;
	}
	Notification.requestPermission().then((_permission) => {});
}

function AppLayout() {
	askNotificationPermission();

	const queryClient = useQueryClient();

	useEffect(() => {
		const socket = new WebSocket(
			`${import.meta.env.VITE_WEBSOCKET_URL}/api/v1/ws`,
		);

		socket.onopen = () => {
			console.log("WebSocket connected");
		};

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);

			switch (message.type) {
				case "announcement.created":
					{
						new Notification("New announcement created", {
							body: message.data,
						});
					}

					queryClient.invalidateQueries({
						queryKey: ["announcements"],
					});

					break;
			}
		};

		socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		return () => {
			socket.close();
		};
	}, [queryClient]);

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
