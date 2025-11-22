"use client";

import { PLANS } from "@progravity/billing";
import { Button } from "@progravity/ui";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { trpc } from "@/lib/trpc";

function BillingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: subscription, isLoading } = trpc.billing.getSubscriptionStatus.useQuery();

    const checkoutMutation = trpc.billing.createCheckoutSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) window.location.href = url;
        },
    });

    const portalMutation = trpc.billing.createPortalSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) window.location.href = url;
        },
    });

    useEffect(() => {
        if (searchParams.get("success")) {
            // TODO: Show success toast
            router.replace("/dashboard/billing");
        }
        if (searchParams.get("canceled")) {
            // TODO: Show canceled toast
            router.replace("/dashboard/billing");
        }
    }, [searchParams, router]);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-8 p-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
                <p className="text-muted-foreground">Manage your subscription plan.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Free Plan */}
                <div className="rounded-lg border p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Free</h3>
                        <p className="text-2xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    </div>
                    <ul className="mb-6 space-y-2 text-sm">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic Features</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Community Support</li>
                    </ul>
                    <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-lg border p-6 shadow-sm ring-1 ring-primary">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">{PLANS.PRO.name}</h3>
                        <p className="text-2xl font-bold">${PLANS.PRO.price / 100}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                        <p className="text-sm text-muted-foreground">{PLANS.PRO.description}</p>
                    </div>
                    <ul className="mb-6 space-y-2 text-sm">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> AI Chat Access</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Priority Support</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Early Access Features</li>
                    </ul>
                    {subscription?.isPro ? (
                        <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => portalMutation.mutate()}
                            disabled={portalMutation.isPending}
                        >
                            Manage Subscription
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            onClick={() => checkoutMutation.mutate({ planId: PLANS.PRO.id })}
                            disabled={checkoutMutation.isPending}
                        >
                            {checkoutMutation.isPending ? "Redirecting..." : "Upgrade to Pro"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BillingContent />
        </Suspense>
    );
}
