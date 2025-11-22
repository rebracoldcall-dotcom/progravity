"use client";

import type { User } from "@progravity/contracts";
import { LogOut, Settings, User as UserIcon } from "lucide-react";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {user.firstName?.[0] || user.email[0].toUpperCase()}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
