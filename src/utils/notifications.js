import { toast } from 'sonner';
export const notify = ({ message, description, type = 'info', txid }) => {
    toast[type](message, {
        description: description,
        action: txid ? {
            label: 'View Transaction',
            onClick: () => window.open(`https://explorer.solana.com/tx/${txid}`, '_blank'),
        } : undefined,
    });
};
