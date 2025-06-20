import { Button } from "@/components/ui/button";

export function AccountDialog({
  isOpen,
  onOpenChange,
  editingAccount,
  onAddClick,
}: any) {
  return (
    <Button
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
      onClick={onAddClick}
    >
      Thêm tài khoản
    </Button>
  );
}
