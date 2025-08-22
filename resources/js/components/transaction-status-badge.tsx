import { Badge } from '@/components/ui/badge';
import { AlertCircleIcon, BanIcon, CheckCircleIcon } from 'lucide-react';

type StatusType = 'pending' | 'failed' | 'success';

type TransactionStatusBadgeProps = {
    status: StatusType;
    text?: string;
};

export default function TransactionStatusBadge({ status, text }: TransactionStatusBadgeProps) {
    switch (status) {
        case 'failed':
            return (
                <Badge variant="outline" className="border-destructive text-destructive [a&]:hover:bg-destructive/10 [a&]:hover:text-destructive/90">
                    <BanIcon className="size-3" />
                    {text || 'Failed'}
                </Badge>
            );
        case 'success':
            return (
                <Badge
                    variant="outline"
                    className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90"
                >
                    <CheckCircleIcon className="size-3" />
                    {text || 'Successful'}
                </Badge>
            );
        case 'pending':
            return (
                <Badge
                    variant="outline"
                    className="border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 [a&]:hover:bg-amber-600/10 [a&]:hover:text-amber-600/90 dark:[a&]:hover:bg-amber-400/10 dark:[a&]:hover:text-amber-400/90"
                >
                    <AlertCircleIcon className="size-3" />
                    {text || 'Pending'}
                </Badge>
            );
        default:
            return null; // or handle unexpected status
    }
}
