"use client";

import { Button, Input, Label } from "@progravity/ui";
import { useTheme } from "next-themes";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { data: user, refetch: refetchUser } = trpc.auth.getUser.useQuery();
    const { data: flags } = trpc.settings.getFeatureFlags.useQuery();

    const updateProfileMutation = trpc.settings.updateProfile.useMutation({
        onSuccess: () => {
            refetchUser();
            // TODO: Show toast success
        },
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate({
            firstName: firstName || undefined,
            lastName: lastName || undefined,
        });
    };

    // Pre-fill form when user data loads
    if (user && !firstName && !lastName) {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
    }

    return (
        <div className="space-y-8 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">Profile</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="John"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                            />
                        </div>
                        <Button type="submit" disabled={updateProfileMutation.isPending}>
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </div>

                {/* Appearance Section */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">Appearance</h3>
                    <div className="flex gap-4">
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                        >
                            Light
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                        >
                            Dark
                        </Button>
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                        >
                            System
                        </Button>
                    </div>
                </div>

                {/* Feature Flags Section */}
                <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">Feature Flags (Active)</h3>
                    <div className="space-y-2">
                        {flags ? (
                            Object.entries(flags).map(([key, enabled]) => (
                                <div key={key} className="flex items-center justify-between rounded border p-2">
                                    <span className="font-mono text-sm">{key}</span>
                                    <span
                                        className={`rounded px-2 py-1 text-xs font-bold ${enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {enabled ? "ENABLED" : "DISABLED"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Loading flags...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
