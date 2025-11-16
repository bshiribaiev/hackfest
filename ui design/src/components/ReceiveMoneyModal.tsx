import { Copy, Share2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface ReceiveMoneyModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReceiveMoneyModal({ open, onClose }: ReceiveMoneyModalProps) {
  const walletAddress = 'johndoe@digitalwallet.com';
  
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied!');
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Money</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-200">
              <div className="w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-32 w-32 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">Your Wallet Address</p>
            <div className="bg-slate-100 p-3 rounded-lg">
              <p className="text-sm break-all">{walletAddress}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={copyAddress}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
