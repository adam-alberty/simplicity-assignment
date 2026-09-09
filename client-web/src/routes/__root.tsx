import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../styles.css";
import { ErrorComponent } from "#/components/error";
import { NotFoundComponent } from "#/components/not-found";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				title: "Test city",
			},
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/logo.svg",
			},
		],
	}),

	component: RootComponent,
	errorComponent: ErrorComponent,
	notFoundComponent: NotFoundComponent,
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "TanStack Query",
						render: <ReactQueryDevtoolsPanel />,
					},
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
