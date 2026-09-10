import { Link, useMatchRoute } from "@tanstack/react-router";
import { Home, Megaphone } from "lucide-react";
import Logo from "@/assets/logo.svg";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	const matchRoute = useMatchRoute();

	return (
		<Sidebar>
			<SidebarHeader>
				<Link
					className="inline-flex gap-2 items-center font-bold text-xl py-3"
					to="/"
				>
					<img src={Logo} alt="logo" className="w-10" />
					<span>Test city</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								size="lg"
								render={
									<Link
										to="/announcements"
										className={
											matchRoute({ to: "/announcements", fuzzy: true })
												? "bg-primary! text-primary-foreground!"
												: ""
										}
									/>
								}
							>
								<Megaphone />
								Announcements
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
}
