import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateAccount,
  useUpdateAccount,
  type Account,
} from "@/lib/hooks/useAccounts";

const MARKETPLACES = ["eBay", "Walmart", "AMZ"];
const STATUSES = ["active", "inactive", "suspended"] as const;

interface AccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingAccount: Account | null;
  onAddClick: () => void;
}

export function AccountDialog({
  isOpen,
  onOpenChange,
  editingAccount,
  onAddClick,
}: AccountDialogProps) {
  const [form, setForm] = useState({
    marketplace: "eBay" as string,
    accName: "",
    profileName: "",
    sheetID: "",
    accountInfo: "",
    proxy: "",
    clientID: "",
    clientSecret: "",
    telegramId: "",
    status: "active" as "active" | "inactive" | "suspended",
  });

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  useEffect(() => {
    if (editingAccount) {
      // Filter out MongoDB-specific properties
      const { _id, createdAt, updatedAt, __v, ...accountData } = editingAccount;
      setForm({ ...form, ...accountData });
    } else {
      setForm({
        marketplace: "eBay" as string,
        accName: "",
        profileName: "",
        sheetID: "",
        accountInfo: "",
        proxy: "",
        clientID: "",
        clientSecret: "",
        telegramId: "",
        status: "active" as "active" | "inactive" | "suspended",
      });
    }
    // eslint-disable-next-line
  }, [editingAccount, isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.accName || !form.marketplace || !form.profileName) return;

    if (editingAccount) {
      // Update existing account
      updateAccountMutation.mutate({
        id: editingAccount._id,
        data: form,
      });
    } else {
      // Create new account
      createAccountMutation.mutate(form);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          onClick={onAddClick}
        >
          Thêm tài khoản
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAccount ? "Sửa tài khoản" : "Thêm tài khoản"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Marketplace
              </label>
              <select
                name="marketplace"
                value={form.marketplace}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                {MARKETPLACES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên tài khoản
              </label>
              <Input
                name="accName"
                value={form.accName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Name
              </label>
              <Input
                name="profileName"
                value={form.profileName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sheet ID</label>
              <Input
                name="sheetID"
                value={form.sheetID}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Thông tin
              </label>
              <Input
                name="accountInfo"
                value={form.accountInfo}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proxy</label>
              <Input name="proxy" value={form.proxy} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Client ID
              </label>
              <Input
                name="clientID"
                value={form.clientID}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Client Secret
              </label>
              <Input
                name="clientSecret"
                value={form.clientSecret}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Telegram ID
              </label>
              <Input
                name="telegramId"
                value={form.telegramId}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {editingAccount ? "Cập nhật" : "Thêm mới"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
