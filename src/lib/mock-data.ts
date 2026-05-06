export type OrderStatus =
  | "Created"
  | "Measurement Confirmed"
  | "Cutting"
  | "Stitching"
  | "Quality Check"
  | "Trial Ready"
  | "Alteration"
  | "Ready for Delivery"
  | "Delivered";

export const ORDER_STATUSES: OrderStatus[] = [
  "Created",
  "Measurement Confirmed",
  "Cutting",
  "Stitching",
  "Quality Check",
  "Trial Ready",
  "Alteration",
  "Ready for Delivery",
  "Delivered",
];

export const customers = [
  { id: "CUS-001", name: "Aarav Sharma", mobile: "+91 98765 43210", email: "aarav@example.com", address: "Bandra, Mumbai", totalOrders: 12, lastOrder: "2026-04-22" },
  { id: "CUS-002", name: "Priya Patel", mobile: "+91 99876 54321", email: "priya@example.com", address: "Koramangala, Bengaluru", totalOrders: 7, lastOrder: "2026-04-29" },
  { id: "CUS-003", name: "Rohan Mehta", mobile: "+91 91234 56780", email: "rohan@example.com", address: "Saket, Delhi", totalOrders: 3, lastOrder: "2026-05-01" },
  { id: "CUS-004", name: "Sneha Iyer", mobile: "+91 90123 45678", email: "sneha@example.com", address: "T. Nagar, Chennai", totalOrders: 18, lastOrder: "2026-05-04" },
  { id: "CUS-005", name: "Vikram Singh", mobile: "+91 99988 77665", email: "vikram@example.com", address: "Hinjewadi, Pune", totalOrders: 5, lastOrder: "2026-04-18" },
  { id: "CUS-006", name: "Ananya Das", mobile: "+91 87654 32109", email: "ananya@example.com", address: "Salt Lake, Kolkata", totalOrders: 9, lastOrder: "2026-05-03" },
  { id: "CUS-007", name: "Karan Kapoor", mobile: "+91 88776 65543", email: "karan@example.com", address: "Sector 17, Chandigarh", totalOrders: 2, lastOrder: "2026-04-12" },
  { id: "CUS-008", name: "Meera Joshi", mobile: "+91 96543 21098", email: "meera@example.com", address: "Vastrapur, Ahmedabad", totalOrders: 14, lastOrder: "2026-05-05" },
];

export const orders = [
  { id: "ORD-1042", customer: "Aarav Sharma", garment: "Suit", qty: 2, tailor: "Imran K.", date: "2026-04-22", delivery: "2026-05-12", priority: "High" as const, status: "Stitching" as OrderStatus, amount: 18500 },
  { id: "ORD-1043", customer: "Priya Patel", garment: "Saree Blouse", qty: 3, tailor: "Sunita R.", date: "2026-04-25", delivery: "2026-05-09", priority: "Medium" as const, status: "Quality Check" as OrderStatus, amount: 4200 },
  { id: "ORD-1044", customer: "Rohan Mehta", garment: "Shirt", qty: 5, tailor: "Imran K.", date: "2026-04-28", delivery: "2026-05-08", priority: "Low" as const, status: "Cutting" as OrderStatus, amount: 6500 },
  { id: "ORD-1045", customer: "Sneha Iyer", garment: "Kurta", qty: 2, tailor: "Vimal P.", date: "2026-04-30", delivery: "2026-05-14", priority: "Medium" as const, status: "Created" as OrderStatus, amount: 3800 },
  { id: "ORD-1046", customer: "Vikram Singh", garment: "Blazer", qty: 1, tailor: "Imran K.", date: "2026-05-01", delivery: "2026-05-18", priority: "High" as const, status: "Measurement Confirmed" as OrderStatus, amount: 12000 },
  { id: "ORD-1047", customer: "Ananya Das", garment: "Pant", qty: 4, tailor: "Vimal P.", date: "2026-05-02", delivery: "2026-05-10", priority: "Low" as const, status: "Trial Ready" as OrderStatus, amount: 5200 },
  { id: "ORD-1048", customer: "Karan Kapoor", garment: "Shirt", qty: 3, tailor: "Sunita R.", date: "2026-05-03", delivery: "2026-05-13", priority: "Medium" as const, status: "Stitching" as OrderStatus, amount: 4500 },
  { id: "ORD-1049", customer: "Meera Joshi", garment: "Saree Blouse", qty: 2, tailor: "Sunita R.", date: "2026-05-04", delivery: "2026-05-11", priority: "High" as const, status: "Ready for Delivery" as OrderStatus, amount: 3600 },
  { id: "ORD-1050", customer: "Aarav Sharma", garment: "Pant", qty: 2, tailor: "Vimal P.", date: "2026-05-05", delivery: "2026-05-15", priority: "Medium" as const, status: "Delivered" as OrderStatus, amount: 2800 },
];

export const inventory = [
  { id: "INV-01", name: "Egyptian Cotton — Navy", category: "Fabrics", qty: 42, unit: "meters", supplier: "Raymond Mills", status: "In Stock" },
  { id: "INV-02", name: "Linen — Beige", category: "Fabrics", qty: 8, unit: "meters", supplier: "Linen House", status: "Low Stock" },
  { id: "INV-03", name: "Wool Blend — Charcoal", category: "Fabrics", qty: 24, unit: "meters", supplier: "Reid & Taylor", status: "In Stock" },
  { id: "INV-04", name: "Polyester Thread — Black", category: "Threads", qty: 120, unit: "spools", supplier: "Coats", status: "In Stock" },
  { id: "INV-05", name: "Polyester Thread — White", category: "Threads", qty: 6, unit: "spools", supplier: "Coats", status: "Low Stock" },
  { id: "INV-06", name: "Mother of Pearl Buttons", category: "Buttons", qty: 480, unit: "pieces", supplier: "Button Co.", status: "In Stock" },
  { id: "INV-07", name: "YKK Zipper — 8 inch", category: "Zippers", qty: 64, unit: "pieces", supplier: "YKK India", status: "In Stock" },
  { id: "INV-08", name: "Shoulder Pads — Medium", category: "Accessories", qty: 3, unit: "pairs", supplier: "Trim Co.", status: "Low Stock" },
];

export const employees = [
  { id: "EMP-01", name: "Imran Khan", role: "Master Tailor", contact: "+91 98765 11122", assigned: 8, performance: 96 },
  { id: "EMP-02", name: "Sunita Rao", role: "Tailor", contact: "+91 99887 33445", assigned: 5, performance: 91 },
  { id: "EMP-03", name: "Vimal Prasad", role: "Tailor", contact: "+91 97654 88990", assigned: 6, performance: 88 },
  { id: "EMP-04", name: "Neha Verma", role: "Receptionist", contact: "+91 90011 22334", assigned: 0, performance: 94 },
  { id: "EMP-05", name: "Ravi Shetty", role: "Inventory Manager", contact: "+91 88990 11223", assigned: 0, performance: 92 },
];

export const invoices = [
  { id: "INV-2026-0142", customer: "Aarav Sharma", order: "ORD-1042", subtotal: 18500, tax: 3330, discount: 0, total: 21830, status: "Paid", method: "UPI", date: "2026-05-01" },
  { id: "INV-2026-0143", customer: "Priya Patel", order: "ORD-1043", subtotal: 4200, tax: 756, discount: 200, total: 4756, status: "Pending", method: "—", date: "2026-05-02" },
  { id: "INV-2026-0144", customer: "Sneha Iyer", order: "ORD-1049", subtotal: 3600, tax: 648, discount: 0, total: 4248, status: "Paid", method: "Card", date: "2026-05-04" },
  { id: "INV-2026-0145", customer: "Vikram Singh", order: "ORD-1046", subtotal: 12000, tax: 2160, discount: 500, total: 13660, status: "Partial", method: "Bank Transfer", date: "2026-05-05" },
];

export const designs = [
  { id: "DSG-01", name: "Classic Italian Suit", garment: "Suit", collar: "Notch Lapel", sleeve: "Two-button", pocket: "Flap", fit: "Slim", neck: "—" },
  { id: "DSG-02", name: "Formal Oxford Shirt", garment: "Shirt", collar: "Spread", sleeve: "Long with cuff", pocket: "Single chest", fit: "Tailored", neck: "—" },
  { id: "DSG-03", name: "Festive Kurta", garment: "Kurta", collar: "Bandh Gala", sleeve: "Full", pocket: "Side", fit: "Regular", neck: "Round" },
  { id: "DSG-04", name: "Designer Blouse", garment: "Saree Blouse", collar: "—", sleeve: "Cap", pocket: "—", fit: "Body-hugging", neck: "Sweetheart" },
];

export const measurements = [
  { id: "MEA-001", customer: "Aarav Sharma", garment: "Shirt", date: "2026-04-22", version: 3, fields: { Neck: 16, Chest: 42, Waist: 36, Shoulder: 18, "Sleeve Length": 25, Armhole: 22, "Shirt Length": 30, Cuff: 9 } },
  { id: "MEA-002", customer: "Priya Patel", garment: "Saree Blouse", date: "2026-04-25", version: 1, fields: { Bust: 36, Waist: 30, "Shoulder Width": 14, "Sleeve Length": 6, "Blouse Length": 14 } },
  { id: "MEA-003", customer: "Rohan Mehta", garment: "Pant", date: "2026-04-28", version: 2, fields: { Waist: 34, Hip: 40, Length: 42, Thigh: 24, Bottom: 14 } },
  { id: "MEA-004", customer: "Vikram Singh", garment: "Blazer", date: "2026-05-01", version: 1, fields: { Chest: 44, Waist: 38, Shoulder: 19, "Sleeve Length": 26, Length: 32 } },
];

export const notifications = [
  { id: 1, type: "order", title: "Order ORD-1049 ready for delivery", time: "5m ago", read: false },
  { id: 2, type: "stock", title: "Linen — Beige stock below threshold", time: "32m ago", read: false },
  { id: 3, type: "payment", title: "Payment pending: INV-2026-0143", time: "1h ago", read: false },
  { id: 4, type: "order", title: "New order ORD-1050 created", time: "2h ago", read: true },
  { id: 5, type: "delivery", title: "Delivery reminder: ORD-1043 due tomorrow", time: "3h ago", read: true },
];

export const weeklyOrders = [
  { day: "Mon", orders: 12 }, { day: "Tue", orders: 18 }, { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 }, { day: "Fri", orders: 28 }, { day: "Sat", orders: 34 }, { day: "Sun", orders: 9 },
];

export const monthlyRevenue = [
  { month: "Nov", revenue: 184000 }, { month: "Dec", revenue: 232000 },
  { month: "Jan", revenue: 198000 }, { month: "Feb", revenue: 241000 },
  { month: "Mar", revenue: 276000 }, { month: "Apr", revenue: 312000 }, { month: "May", revenue: 158000 },
];

export const productionStatus = [
  { name: "Cutting", value: 8 },
  { name: "Stitching", value: 14 },
  { name: "Quality Check", value: 6 },
  { name: "Trial / Alteration", value: 4 },
  { name: "Ready", value: 9 },
];

export const activityFeed = [
  { who: "Sunita R.", action: "marked ORD-1043 as Quality Check", time: "8m ago" },
  { who: "Neha V.", action: "added new customer Meera Joshi", time: "22m ago" },
  { who: "Ravi S.", action: "received 50m fabric from Raymond Mills", time: "1h ago" },
  { who: "Imran K.", action: "completed stitching for ORD-1042", time: "2h ago" },
  { who: "System", action: "generated invoice INV-2026-0145", time: "3h ago" },
];

export const measurementTemplates: Record<string, string[]> = {
  Shirt: ["Neck", "Chest", "Waist", "Shoulder", "Sleeve Length", "Armhole", "Shirt Length", "Cuff"],
  Pant: ["Waist", "Hip", "Length", "Thigh", "Knee", "Bottom"],
  Blazer: ["Chest", "Waist", "Shoulder", "Sleeve Length", "Length", "Lapel"],
  Kurta: ["Chest", "Waist", "Shoulder", "Sleeve Length", "Length", "Neck"],
  "Saree Blouse": ["Bust", "Waist", "Shoulder Width", "Sleeve Length", "Blouse Length", "Front Neck Depth"],
  Suit: ["Chest", "Waist", "Hip", "Shoulder", "Sleeve Length", "Jacket Length", "Trouser Length"],
  Custom: [],
};
