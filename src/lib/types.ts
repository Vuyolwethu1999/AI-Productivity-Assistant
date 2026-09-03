export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  image: string;
  categories: string[];
  composition: string;
  length: number; // inches
  texture: string;
  color: string;
  density: string;
  cap: string;
  quantity: number;
  description: string;
  care: string;
  shipping: string;
  returns: string;
  status: ProductStatus;
  rating: number;
  sold: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
}

export type CustomerTier = "new" | "existing" | "vip";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: CustomerTier;
  joined: string;
  orders: number;
  spent: number;
  notes: string;
}

export type TaskStatus = "todo" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  duration: string;
  deadline: string;
  dependencies: string;
  status: TaskStatus;
  source: "manual" | "ai";
  plan?: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export type AiKind = "email" | "summary" | "plan";

export interface AiRecord {
  id: string;
  kind: AiKind;
  title: string;
  createdAt: string;
  inputs: Record<string, string>;
  output: unknown;
}
