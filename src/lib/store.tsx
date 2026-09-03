import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CUSTOMERS, ORDERS, PRODUCTS, TASKS } from "./data";
import type { AiRecord, CartLine, Customer, Order, Product, Task } from "./types";

const KEY = "zand-state-v1";

interface State {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  tasks: Task[];
  cart: CartLine[];
  wishlist: string[];
  ai: AiRecord[];
}

const initial: State = {
  products: PRODUCTS,
  orders: ORDERS,
  customers: CUSTOMERS,
  tasks: TASKS,
  cart: [],
  wishlist: [],
  ai: [],
};

interface Ctx extends State {
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  setOrders: (fn: (o: Order[]) => Order[]) => void;
  setTasks: (fn: (t: Task[]) => Task[]) => void;
  setCart: (fn: (c: CartLine[]) => CartLine[]) => void;
  toggleWishlist: (id: string) => void;
  addAi: (r: AiRecord) => void;
  removeAi: (id: string) => void;
  hydrated: boolean;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((s) => ({ ...s, ...parsed, products: parsed.products?.length ? parsed.products : s.products }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      setProducts: (fn) => setState((s) => ({ ...s, products: fn(s.products) })),
      setOrders: (fn) => setState((s) => ({ ...s, orders: fn(s.orders) })),
      setTasks: (fn) => setState((s) => ({ ...s, tasks: fn(s.tasks) })),
      setCart: (fn) => setState((s) => ({ ...s, cart: fn(s.cart) })),
      toggleWishlist: (id) =>
        setState((s) => ({
          ...s,
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
        })),
      addAi: (r) => setState((s) => ({ ...s, ai: [r, ...s.ai].slice(0, 50) })),
      removeAi: (id) => setState((s) => ({ ...s, ai: s.ai.filter((a) => a.id !== id) })),
    }),
    [state, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useCartTotals() {
  const { cart, products } = useStore();
  return useMemo(() => {
    const lines = cart
      .map((l) => {
        const product = products.find((p) => p.id === l.productId);
        return product ? { product, qty: l.qty } : null;
      })
      .filter(Boolean) as { product: Product; qty: number }[];
    const subtotal = lines.reduce((sum, l) => sum + (l.product.salePrice ?? l.product.price) * l.qty, 0);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    return { lines, subtotal, count };
  }, [cart, products]);
}

export function useAddToCart() {
  const { setCart } = useStore();
  return useCallback(
    (productId: string, qty = 1) =>
      setCart((c) => {
        const existing = c.find((l) => l.productId === productId);
        return existing
          ? c.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
          : [...c, { productId, qty }];
      }),
    [setCart],
  );
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
