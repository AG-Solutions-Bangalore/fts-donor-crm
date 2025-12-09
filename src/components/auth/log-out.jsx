import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from 'lucide-react';

export default function Logout({ open, setOpen, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-xl bg-gradient-to-br from-gray-100 to-amber-50 p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Your session will be terminated</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Unsaved changes may be lost</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between gap-3 p-6 pt-0 er-gray-200">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1 px-6 py-3 rounded-full border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Logging out...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Yes, Logout</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}