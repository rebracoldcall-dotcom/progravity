"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { cn } from "@progravity/ui";
import { CreditCard, Home, MessageSquare, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold">Progravity</span>
      </div>
      <div className="p-4">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/dashboard/team"
          afterLeaveOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard/team"
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger: "w-full justify-between border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md",
            }
          }}
        />
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
