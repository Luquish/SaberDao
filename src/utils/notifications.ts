import { toast } from 'sonner';

type NotifyType = 'success' | 'error' | 'info' | 'warning';

interface NotifyProps {
  message: string;
  description?: string;
  type?: NotifyType;
  txid?: string;
}

export const notify = ({ message, description, type = 'info', txid }: NotifyProps) => {
  toast[type](message, {
    description: description,
    action: txid ? {
      label: 'View Transaction',
      onClick: () => window.open(`https://explorer.solana.com/tx/${txid}`, '_blank'),
    } : undefined,
  }); 