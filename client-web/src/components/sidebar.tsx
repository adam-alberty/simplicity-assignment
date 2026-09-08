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
					className="inline-flex gap-2 items-center font-bold text-xl"
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
								render={
									<Link
										className={
											matchRoute({ to: "/", fuzzy: true })
												? "bg-primary! text-primary-foreground!"
												: ""
										}
										to="/"
									/>
								}
							>
								<Home />
								Home
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
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
