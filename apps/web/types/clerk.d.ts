export { };

declare global {
    interface UserPublicMetadata {
        stripe?: {
            customerId: string;
            subscriptionId?: string | null;
            status?: string | null;
            planId?: string | null;
        };
    }
}
