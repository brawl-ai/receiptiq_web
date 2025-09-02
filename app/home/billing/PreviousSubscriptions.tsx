"use client"
import { useAuthContext } from "../../stores/auth_store";
import { SubscriptionPlan } from "../../types";
import { useEffect, useState } from "react";
import { useSubscriptionsContext } from "../../stores/subscription_store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";

export default function PreviousSubscriptions() {
    const userSubscriptions = useAuthContext((s) => s.user?.subscriptions ?? []);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const getPlans = useSubscriptionsContext((s) => s.getPlans);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlans().then(resp => {
            setPlans(resp.data);
            setLoading(false);
        });
    }, [getPlans]);

    if (loading) return <Skeleton className="w-full h-32" />;

    const columns = [
        {
            accessorKey: "plan",
            header: "Plan",
            cell: ({ row }) => {
                const plan = plans.find(p => p.id === row.original.subscription_plan_id);
                return <span className="font-semibold text-zinc-900 dark:text-zinc-100">{plan ? plan.name : row.original.subscription_plan_id}</span>;
            }
        },
        {
            accessorKey: "start_at",
            header: "Start Date",
            cell: ({ row }) => <span className="text-zinc-700 dark:text-zinc-300">{new Date(row.original.start_at).toLocaleDateString()}</span>
        },
        {
            accessorKey: "end_at",
            header: "End Date",
            cell: ({ row }) => <span className="text-zinc-700 dark:text-zinc-300">{new Date(row.original.end_at).toLocaleDateString()}</span>
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => <span className={row.original.is_active ? "text-green-600 dark:text-green-400 font-bold" : "text-zinc-500 dark:text-zinc-400"}>{row.original.is_active ? "Active" : "Expired"}</span>
        }
    ];

    return (
        <div className="w-full p-2">
            <div className="mb-4 text-sm text-muted-foreground dark:text-zinc-300">
                This section shows your previous and current subscriptions, including plan details, start/end dates, and status.
            </div>
            <DataTable
                columns={columns}
                data={userSubscriptions}
            />
        </div>
    );
}
