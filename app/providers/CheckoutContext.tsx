import React, { createContext, useContext, useState, ReactNode } from "react";
import { useCart } from "./CartContext";

type CheckoutContextType = {
  selectedItems: string[];
  toggleItem: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  getEstimatedDelivery: () => { min: number; max: number };
};

const CheckoutContext = createContext<CheckoutContextType>(null as any);

export function CheckoutSelectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { items } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = (ids: string[]) => {
    setSelectedItems(ids);
  };

  const clearSelection = () => setSelectedItems([]);

  const getEstimatedDelivery = () => {
    const selectedCartItems = items.filter((i) => selectedItems.includes(i.id));

    if (selectedCartItems.length === 0) return { min: 0, max: 0 };

    let minDay = Infinity;
    let maxDay = -Infinity;

    selectedCartItems.forEach((item) => {
      const shipping = Array.isArray(item.shipping) ? item.shipping : [0, 0];
      const [minShippingDay, maxShippingDay] = shipping;

      if (minShippingDay < minDay) minDay = minShippingDay;
      if (maxShippingDay > maxDay) maxDay = maxShippingDay;
    });

    return { min: minDay, max: maxDay };
  };

  return (
    <CheckoutContext.Provider
      value={{
        selectedItems,
        toggleItem,
        selectAll,
        clearSelection,
        getEstimatedDelivery,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => useContext(CheckoutContext);
