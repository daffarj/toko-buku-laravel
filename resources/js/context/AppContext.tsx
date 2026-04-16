import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book, CartItem } from "../data/mockData";

interface AppContextType {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (method: string) => void;
  shippingAddress: string;
  setShippingAddress: (address: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      book: {
        id: "1",
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        category: "Fiksi",
        price: 85000,
        originalPrice: 110000,
        rating: 4.8,
        reviewCount: 2341,
        cover: "https://images.unsplash.com/photo-1760696473709-a7da66ee87a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        inStock: true,
        stock: 45,
        isbn: "978-979-1411-47-1",
        publisher: "Bentang Pustaka",
        year: 2005,
        pages: 534,
        language: "Indonesia",
        description: "Novel",
        synopsis: "Novel Laskar Pelangi.",
      },
      quantity: 2,
    },
    {
      book: {
        id: "2",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Non-Fiksi",
        price: 120000,
        rating: 4.9,
        reviewCount: 5892,
        cover: "https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        inStock: true,
        stock: 12,
        isbn: "978-602-6417-75-4",
        publisher: "Gramedia Pustaka Utama",
        year: 2019,
        pages: 320,
        language: "Indonesia",
        description: "Self-help",
        synopsis: "Atomic Habits.",
      },
      quantity: 1,
    },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("BCA");
  const [shippingAddress, setShippingAddress] = useState("Jl. Sudirman No. 45, Jakarta Pusat, DKI Jakarta 10220");

  const addToCart = (book: Book, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        shippingAddress,
        setShippingAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
