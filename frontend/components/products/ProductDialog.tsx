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
import { Plus } from "lucide-react";
import { Product } from "@/lib/api/products";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onAddClick: () => void;
  onSubmit: (data: Partial<Product>) => void;
}

export function ProductDialog({
  isOpen,
  onOpenChange,
  editingProduct,
  onAddClick,
  onSubmit,
}: ProductDialogProps) {
  const [form, setForm] = useState({
    sku: "",
    upc: "",
    wmid: "",
    name: "",
    sitePrice: "",
    sellingPrice: "",
  });

  useEffect(() => {
    if (editingProduct) {
      // Filter out MongoDB-specific properties
      const { _id, __v, createdAt, updatedAt, ...productData } = editingProduct;
      setForm({
        ...form,
        ...productData,
        // Convert numbers to strings for display
        sitePrice: productData.sitePrice?.toString() || "",
        sellingPrice: productData.sellingPrice?.toString() || "",
      });
    } else {
      setForm({
        sku: "",
        upc: "",
        wmid: "",
        name: "",
        sitePrice: "",
        sellingPrice: "",
      });
    }
    // eslint-disable-next-line
  }, [editingProduct, isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.sku || !form.upc || !form.wmid || !form.name) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Convert price strings to numbers for submission
    const submitData = {
      ...form,
      sitePrice: parseFloat(form.sitePrice) || 0,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
    };

    onSubmit(submitData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <Input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Nhập SKU"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                UPC <span className="text-red-500">*</span>
              </label>
              <Input
                name="upc"
                value={form.upc}
                onChange={handleChange}
                placeholder="Nhập UPC"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                WMID <span className="text-red-500">*</span>
              </label>
              <Input
                name="wmid"
                value={form.wmid}
                onChange={handleChange}
                placeholder="Nhập WMID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá gốc</label>
              <Input
                name="sitePrice"
                type="number"
                step="0.01"
                value={form.sitePrice}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá bán</label>
              <Input
                name="sellingPrice"
                type="number"
                step="0.01"
                value={form.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {editingProduct ? "Cập nhật" : "Thêm mới"}
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
