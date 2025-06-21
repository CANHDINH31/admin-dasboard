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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Order } from "@/lib/api/orders";

interface OrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingOrder: Order | null;
  onAddClick: () => void;
  onSubmit: (data: Partial<Order>) => void;
}

export function OrderDialog({
  isOpen,
  onOpenChange,
  editingOrder,
  onAddClick,
  onSubmit,
}: OrderDialogProps) {
  const [form, setForm] = useState({
    trackingStatus: "",
    orderNumEmail: "",
    poNumber: "",
    orderNumber: "",
    orderDate: "",
    shipBy: "",
    customerShippingAddress: "",
    quantity: "",
    sku: "",
    sellingPrice: "",
    sourcingPrice: "",
    walmartFee: "",
    netProfit: "",
    roi: "",
    commission: "",
    upc: "",
    name: "",
  });

  useEffect(() => {
    if (editingOrder) {
      // Filter out MongoDB-specific properties
      const { _id, __v, createdAt, updatedAt, ...orderData } = editingOrder;
      setForm({
        ...form,
        ...orderData,
        // Convert dates to strings for display
        orderDate: orderData.orderDate
          ? new Date(orderData.orderDate).toISOString().split("T")[0]
          : "",
        shipBy: orderData.shipBy
          ? new Date(orderData.shipBy).toISOString().split("T")[0]
          : "",
        // Convert numbers to strings for display
        quantity: orderData.quantity?.toString() || "",
        sellingPrice: orderData.sellingPrice?.toString() || "",
        sourcingPrice: orderData.sourcingPrice?.toString() || "",
        walmartFee: orderData.walmartFee?.toString() || "",
        netProfit: orderData.netProfit?.toString() || "",
        roi: orderData.roi?.toString() || "",
        commission: orderData.commission?.toString() || "",
      });
    } else {
      setForm({
        trackingStatus: "",
        orderNumEmail: "",
        poNumber: "",
        orderNumber: "",
        orderDate: "",
        shipBy: "",
        customerShippingAddress: "",
        quantity: "",
        sku: "",
        sellingPrice: "",
        sourcingPrice: "",
        walmartFee: "",
        netProfit: "",
        roi: "",
        commission: "",
        upc: "",
        name: "",
      });
    }
    // eslint-disable-next-line
  }, [editingOrder, isOpen]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.trackingStatus ||
      !form.orderNumEmail ||
      !form.poNumber ||
      !form.orderNumber ||
      !form.sku
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Convert strings to appropriate types for submission
    const submitData = {
      ...form,
      orderDate: new Date(form.orderDate),
      shipBy: new Date(form.shipBy),
      quantity: parseInt(form.quantity) || 0,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      sourcingPrice: parseFloat(form.sourcingPrice) || 0,
      walmartFee: form.walmartFee ? parseFloat(form.walmartFee) : undefined,
      netProfit: form.netProfit ? parseFloat(form.netProfit) : undefined,
      roi: form.roi ? parseFloat(form.roi) : undefined,
      commission: form.commission ? parseFloat(form.commission) : undefined,
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
          Thêm đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? "Sửa đơn hàng" : "Thêm đơn hàng"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.trackingStatus}
                onValueChange={(value) =>
                  handleSelectChange("trackingStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email đơn hàng <span className="text-red-500">*</span>
              </label>
              <Input
                name="orderNumEmail"
                value={form.orderNumEmail}
                onChange={handleChange}
                placeholder="Nhập email đơn hàng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                PO Number <span className="text-red-500">*</span>
              </label>
              <Input
                name="poNumber"
                value={form.poNumber}
                onChange={handleChange}
                placeholder="Nhập PO Number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số đơn hàng <span className="text-red-500">*</span>
              </label>
              <Input
                name="orderNumber"
                value={form.orderNumber}
                onChange={handleChange}
                placeholder="Nhập số đơn hàng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày đặt hàng <span className="text-red-500">*</span>
              </label>
              <Input
                name="orderDate"
                type="date"
                value={form.orderDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Ngày giao hàng <span className="text-red-500">*</span>
              </label>
              <Input
                name="shipBy"
                type="date"
                value={form.shipBy}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Địa chỉ giao hàng <span className="text-red-500">*</span>
              </label>
              <Input
                name="customerShippingAddress"
                value={form.customerShippingAddress}
                onChange={handleChange}
                placeholder="Nhập địa chỉ giao hàng"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <Input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>

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
              <label className="block text-sm font-medium mb-1">UPC</label>
              <Input
                name="upc"
                value={form.upc}
                onChange={handleChange}
                placeholder="Nhập UPC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <Input
                name="sellingPrice"
                type="number"
                step="0.01"
                value={form.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Giá mua <span className="text-red-500">*</span>
              </label>
              <Input
                name="sourcingPrice"
                type="number"
                step="0.01"
                value={form.sourcingPrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phí Walmart
              </label>
              <Input
                name="walmartFee"
                type="number"
                step="0.01"
                value={form.walmartFee}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Lợi nhuận ròng
              </label>
              <Input
                name="netProfit"
                type="number"
                step="0.01"
                value={form.netProfit}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ROI (%)</label>
              <Input
                name="roi"
                type="number"
                step="0.01"
                value={form.roi}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hoa hồng</label>
              <Input
                name="commission"
                type="number"
                step="0.01"
                value={form.commission}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">
              {editingOrder ? "Cập nhật" : "Thêm mới"}
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
