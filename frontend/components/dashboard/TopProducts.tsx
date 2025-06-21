import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package } from "lucide-react";

interface TopProductsProps {
  topProducts: Array<{
    _id: string;
    totalQuantity: number;
    totalRevenue: number;
    name: string;
  }>;
}

export const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Selling Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <span className="text-sm font-semibold text-primary">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {product.name || "Unknown Product"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    SKU: {product._id}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(product.totalRevenue)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatNumber(product.totalQuantity)} units sold
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
