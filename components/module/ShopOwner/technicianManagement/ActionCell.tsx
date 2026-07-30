/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateTechnicianStatusMutation } from "@/redux/api/shopOwnerDashboardApi";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

const ActionCell = ({ id }: any) => {
  const [updateStatus, { isLoading }] = useUpdateTechnicianStatusMutation();

  const handleStatusChange = async () => {
    try {
      await updateStatus({ id, status: "BLOCKED" }).unwrap();
      toast.success("Technician deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete technician.");
      console.error("Failed to update status:", err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={isLoading}
          className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : <Trash2 className="w-5 h-5" />}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the technician. You can’t undo this change.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleStatusChange} disabled={isLoading}>
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionCell;
