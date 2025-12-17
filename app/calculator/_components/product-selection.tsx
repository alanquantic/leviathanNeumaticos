'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

type ProductType = '3-inch' | '1-inch' | 'crumb' | null;

interface ProductSelectionProps {
  onSelect: (product: ProductType) => void;
  selectedProduct: ProductType;
}

export default function ProductSelection({ onSelect, selectedProduct }: ProductSelectionProps) {
  const { t } = useLanguage();
  
  const products = [
    {
      id: '3-inch' as ProductType,
      title: t.calculator.products['3-inch'].title,
      description: t.calculator.products['3-inch'].description,
      details: t.calculator.products['3-inch'].details,
      stages: t.calculator.products['3-inch'].stages,
      color: 'blue',
    },
    {
      id: '1-inch' as ProductType,
      title: t.calculator.products['1-inch'].title,
      description: t.calculator.products['1-inch'].description,
      details: t.calculator.products['1-inch'].details,
      stages: t.calculator.products['1-inch'].stages,
      color: 'green',
    },
    {
      id: 'crumb' as ProductType,
      title: t.calculator.products['crumb'].title,
      description: t.calculator.products['crumb'].description,
      details: t.calculator.products['crumb'].details,
      stages: t.calculator.products['crumb'].stages,
      color: 'purple',
    },
  ];

  const handleSelect = (productId: ProductType) => {
    onSelect?.(productId);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {products?.map((product) => {
        const isSelected = selectedProduct === product?.id;
        const colorClasses = {
          blue: 'border-blue-400 bg-blue-50',
          green: 'border-green-400 bg-green-50',
          purple: 'border-purple-400 bg-purple-50',
        };
        const iconColorClasses = {
          blue: 'bg-blue-100 text-blue-600',
          green: 'bg-green-100 text-green-600',
          purple: 'bg-purple-100 text-purple-600',
        };

        return (
          <Card
            key={product?.id}
            className={`relative border-2 transition-all hover:shadow-lg ${
              isSelected ? colorClasses[product?.color as keyof typeof colorClasses] : ''
            }`}
          >
            {isSelected && (
              <div className="absolute right-4 top-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}
            <CardHeader>
              <div
                className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${
                  iconColorClasses[product?.color as keyof typeof iconColorClasses]
                }`}
              >
                <Package className="h-6 w-6" />
              </div>
              <CardTitle>{product?.title}</CardTitle>
              <CardDescription>{product?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">{product?.details}</p>
              <div className="pt-2">
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {product?.stages}
                </span>
              </div>
              <Button 
                className="mt-4 w-full" 
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => handleSelect(product?.id)}
              >
                {isSelected ? t.calculator.selectedButton : t.calculator.selectButton}
              </Button>
            </CardContent>
          </Card>
        );
      }) ?? []}
    </div>
  );
}
