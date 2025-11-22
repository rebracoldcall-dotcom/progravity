"use client";

import { useUser } from "@clerk/nextjs";
import { Button, Input, Label } from "@progravity/ui";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";

export default function TeamPage() {
    const { user } = useUser();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const { data: team, isLoading: isTeamLoading } = trpc.team.getCurrent.useQuery();
    const { data: members, isLoading: isMembersLoading, refetch } = trpc.team.getMembers.useQuery();

    const inviteMutation = trpc.team.inviteMember.useMutation({
        onSuccess: () => {
            setIsInviteOpen(false);
            alert("Invitation sent!");
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const { register, handleSubmit, reset } = useForm<{ email: string }>();

    const onInvite = (data: { email: string }) => {
        inviteMutation.mutate({ email: data.email, role: "org:member" });
        reset();
    };

    if (isTeamLoading || isMembersLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!team) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold">No Organization Selected</h2>
                <p className="text-muted-foreground">Please create or select an organization from the sidebar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
                    <p className="text-muted-foreground">Manage your team members and settings.</p>
                </div>
                <Button onClick={() => setIsInviteOpen(!isInviteOpen)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                </Button>
            </div>

            {isInviteOpen && (
                <div className="rounded-lg border p-4 shadow-sm bg-card">
                    <h3 className="mb-4 text-lg font-medium">Invite New Member</h3>
                    <form onSubmit={handleSubmit(onInvite)} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@example.com"
                                {...register("email", { required: true })}
                            />
                        </div>
                        <Button type="submit" disabled={inviteMutation.isPending}>
                            {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                        </Button>
                    </form>
                </div>
            )}

            <div className="rounded-md border">
                <div className="p-4">
                    <h3 className="font-medium">Team Members</h3>
                </div>
                <div className="divide-y">
                    {members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={member.imageUrl}
                                    alt={member.firstName || "User"}
                                    className="h-10 w-10 rounded-full bg-muted"
                                />
                                <div>
                                    <p className="font-medium">
                                        {member.firstName} {member.lastName}
                                        {member.userId === user?.id ? " (You)" : ""}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    {member.role.replace("org:", "")}
                                </span>
                            </div>
                        </div>
                    ))}
                    {members?.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No members found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
