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
  { id: "CUS-001", name: "Aarav Sharma",     mobile: "+91 98765 43210", email: "aarav@example.com",     address: "Bandra West, Mumbai",         totalOrders: 12, lastOrder: "2026-06-09" },
  { id: "CUS-002", name: "Priya Patel",      mobile: "+91 99876 54321", email: "priya@example.com",     address: "Koramangala, Bengaluru",      totalOrders: 7,  lastOrder: "2026-06-11" },
  { id: "CUS-003", name: "Rohan Mehta",      mobile: "+91 91234 56780", email: "rohan@example.com",     address: "Saket, Delhi",                totalOrders: 3,  lastOrder: "2026-06-04" },
  { id: "CUS-004", name: "Sneha Iyer",       mobile: "+91 90123 45678", email: "sneha@example.com",     address: "T. Nagar, Chennai",           totalOrders: 18, lastOrder: "2026-06-12" },
  { id: "CUS-005", name: "Vikram Singh",     mobile: "+91 99988 77665", email: "vikram@example.com",    address: "Hinjewadi, Pune",             totalOrders: 5,  lastOrder: "2026-05-30" },
  { id: "CUS-006", name: "Ananya Das",       mobile: "+91 87654 32109", email: "ananya@example.com",    address: "Salt Lake, Kolkata",          totalOrders: 9,  lastOrder: "2026-06-10" },
  { id: "CUS-007", name: "Karan Kapoor",     mobile: "+91 88776 65543", email: "karan@example.com",     address: "Sector 17, Chandigarh",       totalOrders: 2,  lastOrder: "2026-05-22" },
  { id: "CUS-008", name: "Meera Joshi",      mobile: "+91 96543 21098", email: "meera@example.com",     address: "Vastrapur, Ahmedabad",        totalOrders: 14, lastOrder: "2026-06-12" },
  { id: "CUS-009", name: "Devansh Bhatia",   mobile: "+91 98220 11445", email: "devansh@example.com",   address: "Powai, Mumbai",               totalOrders: 4,  lastOrder: "2026-06-06" },
  { id: "CUS-010", name: "Ishita Reddy",     mobile: "+91 90087 33221", email: "ishita@example.com",    address: "Jubilee Hills, Hyderabad",    totalOrders: 11, lastOrder: "2026-06-09" },
  { id: "CUS-011", name: "Arjun Nair",       mobile: "+91 95566 77881", email: "arjun@example.com",     address: "Marine Drive, Kochi",         totalOrders: 6,  lastOrder: "2026-06-07" },
  { id: "CUS-012", name: "Kavya Menon",      mobile: "+91 94411 22669", email: "kavya@example.com",     address: "Indiranagar, Bengaluru",      totalOrders: 8,  lastOrder: "2026-06-12" },
  { id: "CUS-013", name: "Rahul Khanna",     mobile: "+91 99100 88227", email: "rahul@example.com",     address: "Greater Kailash, Delhi",      totalOrders: 22, lastOrder: "2026-06-11" },
  { id: "CUS-014", name: "Aditi Saxena",     mobile: "+91 90909 11223", email: "aditi@example.com",     address: "Civil Lines, Jaipur",         totalOrders: 5,  lastOrder: "2026-06-08" },
  { id: "CUS-015", name: "Nikhil Gupta",     mobile: "+91 88001 22334", email: "nikhil@example.com",    address: "Aundh, Pune",                 totalOrders: 3,  lastOrder: "2026-05-28" },
  { id: "CUS-016", name: "Shruti Pillai",    mobile: "+91 97700 55678", email: "shruti@example.com",    address: "Adyar, Chennai",              totalOrders: 10, lastOrder: "2026-06-10" },
  { id: "CUS-017", name: "Yash Agarwal",     mobile: "+91 98998 44556", email: "yash@example.com",      address: "Vasant Vihar, Delhi",         totalOrders: 7,  lastOrder: "2026-06-05" },
  { id: "CUS-018", name: "Tara Krishnan",    mobile: "+91 99445 11220", email: "tara@example.com",      address: "Besant Nagar, Chennai",       totalOrders: 13, lastOrder: "2026-06-11" },
  { id: "CUS-019", name: "Manav Chopra",     mobile: "+91 88334 99110", email: "manav@example.com",     address: "Andheri East, Mumbai",        totalOrders: 4,  lastOrder: "2026-06-03" },
  { id: "CUS-020", name: "Riya Bansal",      mobile: "+91 90011 88776", email: "riya@example.com",      address: "Vaishali Nagar, Jaipur",      totalOrders: 6,  lastOrder: "2026-06-09" },
  { id: "CUS-021", name: "Siddharth Rao",    mobile: "+91 91188 77665", email: "siddharth@example.com", address: "Banjara Hills, Hyderabad",    totalOrders: 9,  lastOrder: "2026-06-12" },
  { id: "CUS-022", name: "Pooja Desai",      mobile: "+91 99776 66554", email: "pooja@example.com",     address: "Bodakdev, Ahmedabad",         totalOrders: 5,  lastOrder: "2026-06-02" },
  { id: "CUS-023", name: "Harsh Vardhan",    mobile: "+91 88665 44332", email: "harsh@example.com",     address: "Gomti Nagar, Lucknow",        totalOrders: 2,  lastOrder: "2026-05-25" },
  { id: "CUS-024", name: "Divya Suresh",     mobile: "+91 97553 33221", email: "divya@example.com",     address: "HSR Layout, Bengaluru",       totalOrders: 8,  lastOrder: "2026-06-10" },
];

export type Priority = "High" | "Medium" | "Low";
export type Order = {
  id: string;
  customer: string;
  garment: string;
  qty: number;
  tailor: string;
  branch: string;
  date: string;
  delivery: string;
  priority: Priority;
  status: OrderStatus;
  amount: number;
};

const TAILORS = ["Imran K.", "Sunita R.", "Vimal P.", "Anita D.", "Ramesh T."];
const BRANCHES = ["Bandra Flagship", "Koramangala", "T. Nagar"] as const;

function mk(i: number, base: Omit<Order, "id" | "tailor" | "branch">): Order {
  return {
    id: `ORD-${1041 + i}`,
    tailor: TAILORS[i % TAILORS.length],
    branch: BRANCHES[i % BRANCHES.length],
    ...base,
  };
}

export const orders: Order[] = [
  mk(1,  { customer: "Aarav Sharma",   garment: "Suit",          qty: 2, status: "Stitching",             date: "2026-05-22", delivery: "2026-06-12", priority: "High",   amount: 18500 }),
  mk(2,  { customer: "Priya Patel",    garment: "Saree Blouse",  qty: 3, status: "Quality Check",         date: "2026-05-25", delivery: "2026-06-09", priority: "Medium", amount: 4200  }),
  mk(3,  { customer: "Rohan Mehta",    garment: "Shirt",         qty: 5, status: "Cutting",               date: "2026-05-28", delivery: "2026-06-15", priority: "Low",    amount: 6500  }),
  mk(4,  { customer: "Sneha Iyer",     garment: "Kurta",         qty: 2, status: "Created",               date: "2026-06-01", delivery: "2026-06-18", priority: "Medium", amount: 3800  }),
  mk(5,  { customer: "Vikram Singh",   garment: "Blazer",        qty: 1, status: "Measurement Confirmed", date: "2026-06-02", delivery: "2026-06-20", priority: "High",   amount: 12000 }),
  mk(6,  { customer: "Ananya Das",     garment: "Pant",          qty: 4, status: "Trial Ready",           date: "2026-06-02", delivery: "2026-06-14", priority: "Low",    amount: 5200  }),
  mk(7,  { customer: "Karan Kapoor",   garment: "Shirt",         qty: 3, status: "Stitching",             date: "2026-06-03", delivery: "2026-06-16", priority: "Medium", amount: 4500  }),
  mk(8,  { customer: "Meera Joshi",    garment: "Saree Blouse",  qty: 2, status: "Ready for Delivery",    date: "2026-06-04", delivery: "2026-06-13", priority: "High",   amount: 3600  }),
  mk(9,  { customer: "Aarav Sharma",   garment: "Pant",          qty: 2, status: "Delivered",             date: "2026-05-15", delivery: "2026-05-26", priority: "Medium", amount: 2800  }),
  mk(10, { customer: "Devansh Bhatia", garment: "Sherwani",      qty: 1, status: "Stitching",             date: "2026-05-30", delivery: "2026-06-17", priority: "High",   amount: 24500 }),
  mk(11, { customer: "Ishita Reddy",   garment: "Lehenga",       qty: 1, status: "Cutting",               date: "2026-06-01", delivery: "2026-06-22", priority: "High",   amount: 32000 }),
  mk(12, { customer: "Arjun Nair",     garment: "Shirt",         qty: 4, status: "Quality Check",         date: "2026-06-02", delivery: "2026-06-12", priority: "Medium", amount: 5600  }),
  mk(13, { customer: "Kavya Menon",    garment: "Kurta",         qty: 2, status: "Trial Ready",           date: "2026-06-03", delivery: "2026-06-14", priority: "Low",    amount: 3400  }),
  mk(14, { customer: "Rahul Khanna",   garment: "Suit",          qty: 1, status: "Alteration",            date: "2026-05-20", delivery: "2026-06-11", priority: "High",   amount: 21500 }),
  mk(15, { customer: "Aditi Saxena",   garment: "Saree Blouse",  qty: 2, status: "Stitching",             date: "2026-06-04", delivery: "2026-06-15", priority: "Medium", amount: 2800  }),
  mk(16, { customer: "Nikhil Gupta",   garment: "Pant",          qty: 3, status: "Created",               date: "2026-06-05", delivery: "2026-06-19", priority: "Low",    amount: 3900  }),
  mk(17, { customer: "Shruti Pillai",  garment: "Blazer",        qty: 1, status: "Measurement Confirmed", date: "2026-06-05", delivery: "2026-06-21", priority: "Medium", amount: 11500 }),
  mk(18, { customer: "Yash Agarwal",   garment: "Shirt",         qty: 6, status: "Stitching",             date: "2026-06-06", delivery: "2026-06-17", priority: "Medium", amount: 7800  }),
  mk(19, { customer: "Tara Krishnan",  garment: "Saree Blouse",  qty: 4, status: "Quality Check",         date: "2026-06-07", delivery: "2026-06-13", priority: "High",   amount: 6400  }),
  mk(20, { customer: "Manav Chopra",   garment: "Kurta",         qty: 2, status: "Cutting",               date: "2026-06-07", delivery: "2026-06-18", priority: "Low",    amount: 3200  }),
  mk(21, { customer: "Riya Bansal",    garment: "Lehenga",       qty: 1, status: "Stitching",             date: "2026-05-28", delivery: "2026-06-20", priority: "High",   amount: 28500 }),
  mk(22, { customer: "Siddharth Rao",  garment: "Suit",          qty: 1, status: "Trial Ready",           date: "2026-05-29", delivery: "2026-06-13", priority: "Medium", amount: 19000 }),
  mk(23, { customer: "Pooja Desai",    garment: "Saree Blouse",  qty: 3, status: "Ready for Delivery",    date: "2026-06-01", delivery: "2026-06-12", priority: "Medium", amount: 4500  }),
  mk(24, { customer: "Harsh Vardhan",  garment: "Shirt",         qty: 2, status: "Delivered",             date: "2026-05-18", delivery: "2026-05-29", priority: "Low",    amount: 2400  }),
  mk(25, { customer: "Divya Suresh",   garment: "Kurta",         qty: 3, status: "Stitching",             date: "2026-06-04", delivery: "2026-06-16", priority: "Medium", amount: 4800  }),
  mk(26, { customer: "Aarav Sharma",   garment: "Shirt",         qty: 4, status: "Created",               date: "2026-06-09", delivery: "2026-06-22", priority: "Low",    amount: 5200  }),
  mk(27, { customer: "Priya Patel",    garment: "Lehenga",       qty: 1, status: "Cutting",               date: "2026-06-08", delivery: "2026-06-25", priority: "High",   amount: 26500 }),
  mk(28, { customer: "Sneha Iyer",     garment: "Saree Blouse",  qty: 5, status: "Stitching",             date: "2026-06-08", delivery: "2026-06-18", priority: "Medium", amount: 7800  }),
  mk(29, { customer: "Ananya Das",     garment: "Kurta",         qty: 2, status: "Quality Check",         date: "2026-06-09", delivery: "2026-06-14", priority: "Medium", amount: 3600  }),
  mk(30, { customer: "Meera Joshi",    garment: "Blazer",        qty: 1, status: "Ready for Delivery",    date: "2026-06-05", delivery: "2026-06-12", priority: "High",   amount: 11800 }),
  mk(31, { customer: "Devansh Bhatia", garment: "Pant",          qty: 3, status: "Delivered",             date: "2026-05-22", delivery: "2026-06-02", priority: "Low",    amount: 4200  }),
  mk(32, { customer: "Ishita Reddy",   garment: "Saree Blouse",  qty: 2, status: "Trial Ready",           date: "2026-06-04", delivery: "2026-06-13", priority: "Medium", amount: 3400  }),
  mk(33, { customer: "Arjun Nair",     garment: "Suit",          qty: 1, status: "Stitching",             date: "2026-06-06", delivery: "2026-06-23", priority: "High",   amount: 18900 }),
  mk(34, { customer: "Kavya Menon",    garment: "Pant",          qty: 2, status: "Created",               date: "2026-06-10", delivery: "2026-06-22", priority: "Low",    amount: 2800  }),
  mk(35, { customer: "Rahul Khanna",   garment: "Sherwani",      qty: 1, status: "Quality Check",         date: "2026-05-30", delivery: "2026-06-13", priority: "High",   amount: 28500 }),
  mk(36, { customer: "Aditi Saxena",   garment: "Kurta",         qty: 2, status: "Stitching",             date: "2026-06-07", delivery: "2026-06-18", priority: "Medium", amount: 3600  }),
  mk(37, { customer: "Nikhil Gupta",   garment: "Shirt",         qty: 3, status: "Delivered",             date: "2026-05-19", delivery: "2026-05-28", priority: "Low",    amount: 3900  }),
  mk(38, { customer: "Shruti Pillai",  garment: "Saree Blouse",  qty: 2, status: "Cutting",               date: "2026-06-08", delivery: "2026-06-19", priority: "Medium", amount: 3200  }),
  mk(39, { customer: "Yash Agarwal",   garment: "Blazer",        qty: 1, status: "Stitching",             date: "2026-06-05", delivery: "2026-06-20", priority: "High",   amount: 12500 }),
  mk(40, { customer: "Tara Krishnan",  garment: "Lehenga",       qty: 1, status: "Measurement Confirmed", date: "2026-06-09", delivery: "2026-06-26", priority: "High",   amount: 31000 }),
  mk(41, { customer: "Manav Chopra",   garment: "Shirt",         qty: 5, status: "Trial Ready",           date: "2026-06-03", delivery: "2026-06-13", priority: "Medium", amount: 6400  }),
  mk(42, { customer: "Divya Suresh",   garment: "Pant",          qty: 2, status: "Ready for Delivery",    date: "2026-06-04", delivery: "2026-06-12", priority: "Medium", amount: 3100  }),
];

export const inventory = [
  { id: "INV-01", name: "Egyptian Cotton — Navy",     category: "Fabrics",     qty: 42,  unit: "meters", supplier: "Raymond Mills",  status: "In Stock"  },
  { id: "INV-02", name: "Linen — Beige",              category: "Fabrics",     qty: 8,   unit: "meters", supplier: "Linen House",    status: "Low Stock" },
  { id: "INV-03", name: "Wool Blend — Charcoal",      category: "Fabrics",     qty: 24,  unit: "meters", supplier: "Reid & Taylor",  status: "In Stock"  },
  { id: "INV-04", name: "Polyester Thread — Black",   category: "Threads",     qty: 120, unit: "spools", supplier: "Coats",          status: "In Stock"  },
  { id: "INV-05", name: "Polyester Thread — White",   category: "Threads",     qty: 6,   unit: "spools", supplier: "Coats",          status: "Low Stock" },
  { id: "INV-06", name: "Mother of Pearl Buttons",    category: "Buttons",     qty: 480, unit: "pieces", supplier: "Button Co.",     status: "In Stock"  },
  { id: "INV-07", name: "YKK Zipper — 8 inch",        category: "Zippers",     qty: 64,  unit: "pieces", supplier: "YKK India",      status: "In Stock"  },
  { id: "INV-08", name: "Shoulder Pads — Medium",     category: "Accessories", qty: 3,   unit: "pairs",  supplier: "Trim Co.",       status: "Low Stock" },
  { id: "INV-09", name: "Silk Brocade — Maroon",      category: "Fabrics",     qty: 18,  unit: "meters", supplier: "Banaras Looms",  status: "In Stock"  },
  { id: "INV-10", name: "Cotton Lining — White",      category: "Linings",     qty: 56,  unit: "meters", supplier: "Arvind Mills",   status: "In Stock"  },
  { id: "INV-11", name: "Horn Buttons — Brown",       category: "Buttons",     qty: 220, unit: "pieces", supplier: "Button Co.",     status: "In Stock"  },
  { id: "INV-12", name: "Canvas Interlining",         category: "Linings",     qty: 4,   unit: "meters", supplier: "Trim Co.",       status: "Low Stock" },
];

export const employees = [
  { id: "EMP-01", name: "Imran Khan",       role: "Master Tailor",      contact: "+91 98765 11122", assigned: 8, performance: 96 },
  { id: "EMP-02", name: "Sunita Rao",       role: "Tailor",             contact: "+91 99887 33445", assigned: 5, performance: 91 },
  { id: "EMP-03", name: "Vimal Prasad",     role: "Tailor",             contact: "+91 97654 88990", assigned: 6, performance: 88 },
  { id: "EMP-04", name: "Neha Verma",       role: "Receptionist",       contact: "+91 90011 22334", assigned: 0, performance: 94 },
  { id: "EMP-05", name: "Ravi Shetty",      role: "Inventory Manager",  contact: "+91 88990 11223", assigned: 0, performance: 92 },
  { id: "EMP-06", name: "Anita Devi",       role: "Tailor",             contact: "+91 90909 55667", assigned: 7, performance: 89 },
  { id: "EMP-07", name: "Ramesh Thakur",    role: "Master Tailor",      contact: "+91 91234 77889", assigned: 9, performance: 95 },
  { id: "EMP-08", name: "Priya Raman",      role: "Receptionist",       contact: "+91 99887 11223", assigned: 0, performance: 93 },
  { id: "EMP-09", name: "Lakshmi Subbu",    role: "Inventory Manager",  contact: "+91 88776 44556", assigned: 0, performance: 90 },
  { id: "EMP-10", name: "Karthik Iyer",     role: "Tailor",             contact: "+91 90123 66778", assigned: 6, performance: 87 },
  { id: "EMP-11", name: "Aarav Mehta",      role: "Branch Manager",     contact: "+91 99001 22233", assigned: 0, performance: 97 },
];

export const invoices = [
  { id: "INV-2026-0142", customer: "Aarav Sharma",   order: "ORD-1042", subtotal: 18500, tax: 3330, discount: 0,   total: 21830, status: "Paid",    method: "UPI",           date: "2026-05-28" },
  { id: "INV-2026-0143", customer: "Priya Patel",    order: "ORD-1043", subtotal: 4200,  tax: 756,  discount: 200, total: 4756,  status: "Pending", method: "—",             date: "2026-06-02" },
  { id: "INV-2026-0144", customer: "Sneha Iyer",     order: "ORD-1049", subtotal: 3600,  tax: 648,  discount: 0,   total: 4248,  status: "Paid",    method: "Card",          date: "2026-06-04" },
  { id: "INV-2026-0145", customer: "Vikram Singh",   order: "ORD-1046", subtotal: 12000, tax: 2160, discount: 500, total: 13660, status: "Partial", method: "Bank Transfer", date: "2026-06-05" },
  { id: "INV-2026-0146", customer: "Ananya Das",     order: "ORD-1047", subtotal: 5200,  tax: 936,  discount: 0,   total: 6136,  status: "Paid",    method: "UPI",           date: "2026-06-06" },
  { id: "INV-2026-0147", customer: "Meera Joshi",    order: "ORD-1050", subtotal: 3600,  tax: 648,  discount: 0,   total: 4248,  status: "Paid",    method: "Cash",          date: "2026-06-07" },
  { id: "INV-2026-0148", customer: "Rahul Khanna",   order: "ORD-1055", subtotal: 21500, tax: 3870, discount: 800, total: 24570, status: "Pending", method: "—",             date: "2026-06-08" },
  { id: "INV-2026-0149", customer: "Ishita Reddy",   order: "ORD-1052", subtotal: 32000, tax: 5760, discount: 0,   total: 37760, status: "Partial", method: "Bank Transfer", date: "2026-06-08" },
  { id: "INV-2026-0150", customer: "Tara Krishnan",  order: "ORD-1060", subtotal: 6400,  tax: 1152, discount: 0,   total: 7552,  status: "Paid",    method: "UPI",           date: "2026-06-10" },
  { id: "INV-2026-0151", customer: "Sneha Iyer",     order: "ORD-1069", subtotal: 7800,  tax: 1404, discount: 200, total: 9004,  status: "Paid",    method: "Card",          date: "2026-06-11" },
  { id: "INV-2026-0152", customer: "Divya Suresh",   order: "ORD-1083", subtotal: 3100,  tax: 558,  discount: 0,   total: 3658,  status: "Paid",    method: "UPI",           date: "2026-06-12" },
  { id: "INV-2026-0153", customer: "Aarav Sharma",   order: "ORD-1067", subtotal: 5200,  tax: 936,  discount: 0,   total: 6136,  status: "Pending", method: "—",             date: "2026-06-12" },
];

export const designs = [
  { id: "DSG-01", name: "Classic Italian Suit",    garment: "Suit",          collar: "Notch Lapel", sleeve: "Two-button",     pocket: "Flap",          fit: "Slim",          neck: "—" },
  { id: "DSG-02", name: "Formal Oxford Shirt",     garment: "Shirt",         collar: "Spread",      sleeve: "Long with cuff", pocket: "Single chest",  fit: "Tailored",      neck: "—" },
  { id: "DSG-03", name: "Festive Kurta",           garment: "Kurta",         collar: "Bandh Gala",  sleeve: "Full",           pocket: "Side",          fit: "Regular",       neck: "Round" },
  { id: "DSG-04", name: "Designer Blouse",         garment: "Saree Blouse",  collar: "—",           sleeve: "Cap",            pocket: "—",             fit: "Body-hugging",  neck: "Sweetheart" },
  { id: "DSG-05", name: "Royal Sherwani",          garment: "Sherwani",      collar: "Bandh Gala",  sleeve: "Full",           pocket: "Welt",          fit: "Regular",       neck: "—" },
  { id: "DSG-06", name: "Bridal Lehenga",          garment: "Lehenga",       collar: "—",           sleeve: "Three-quarter",  pocket: "—",             fit: "A-Line",        neck: "V-Neck" },
];

export const measurements = [
  { id: "MEA-001", customer: "Aarav Sharma",  garment: "Shirt",        date: "2026-06-09", version: 3, fields: { Neck: 16, Chest: 42, Waist: 36, Shoulder: 18, "Sleeve Length": 25, Armhole: 22, "Shirt Length": 30, Cuff: 9 } },
  { id: "MEA-002", customer: "Priya Patel",   garment: "Saree Blouse", date: "2026-05-25", version: 1, fields: { Bust: 36, Waist: 30, "Shoulder Width": 14, "Sleeve Length": 6, "Blouse Length": 14 } },
  { id: "MEA-003", customer: "Rohan Mehta",   garment: "Pant",         date: "2026-05-28", version: 2, fields: { Waist: 34, Hip: 40, Length: 42, Thigh: 24, Bottom: 14 } },
  { id: "MEA-004", customer: "Vikram Singh",  garment: "Blazer",       date: "2026-06-02", version: 1, fields: { Chest: 44, Waist: 38, Shoulder: 19, "Sleeve Length": 26, Length: 32 } },
  { id: "MEA-005", customer: "Sneha Iyer",    garment: "Kurta",        date: "2026-06-01", version: 2, fields: { Chest: 36, Waist: 30, Shoulder: 14, "Sleeve Length": 20, Length: 38, Neck: 14 } },
  { id: "MEA-006", customer: "Aarav Sharma",  garment: "Pant",         date: "2026-06-09", version: 1, fields: { Waist: 36, Hip: 42, Length: 41, Thigh: 25, Bottom: 14 } },
  { id: "MEA-007", customer: "Sneha Iyer",    garment: "Saree Blouse", date: "2026-06-08", version: 1, fields: { Bust: 38, Waist: 32, "Shoulder Width": 14, "Sleeve Length": 7, "Blouse Length": 15 } },
  { id: "MEA-008", customer: "Rahul Khanna",  garment: "Suit",         date: "2026-05-20", version: 4, fields: { Chest: 46, Waist: 40, Hip: 44, Shoulder: 19, "Sleeve Length": 26, "Jacket Length": 31, "Trouser Length": 42 } },
];

export const notifications = [
  { id: 1, type: "order",    title: "Order ORD-1049 ready for delivery",        time: "5m ago",  read: false },
  { id: 2, type: "stock",    title: "Linen — Beige stock below threshold",      time: "32m ago", read: false },
  { id: 3, type: "payment",  title: "Payment pending: INV-2026-0143",           time: "1h ago",  read: false },
  { id: 4, type: "order",    title: "New order ORD-1083 created by Priya R.",   time: "2h ago",  read: true  },
  { id: 5, type: "delivery", title: "Delivery reminder: ORD-1043 due tomorrow", time: "3h ago",  read: true  },
  { id: 6, type: "order",    title: "Trial ready: ORD-1060 (Tara Krishnan)",    time: "4h ago",  read: true  },
  { id: 7, type: "stock",    title: "Canvas Interlining low stock",             time: "5h ago",  read: true  },
  { id: 8, type: "payment",  title: "Payment received ₹37,760 (Ishita Reddy)",  time: "6h ago",  read: true  },
];

export const weeklyOrders = [
  { day: "Mon", orders: 12 }, { day: "Tue", orders: 18 }, { day: "Wed", orders: 15 },
  { day: "Thu", orders: 22 }, { day: "Fri", orders: 28 }, { day: "Sat", orders: 34 }, { day: "Sun", orders: 9 },
];

export const monthlyRevenue = [
  { month: "Dec", revenue: 232000 }, { month: "Jan", revenue: 198000 },
  { month: "Feb", revenue: 241000 }, { month: "Mar", revenue: 276000 },
  { month: "Apr", revenue: 312000 }, { month: "May", revenue: 358000 }, { month: "Jun", revenue: 184000 },
];

export const productionStatus = [
  { name: "Cutting",            value: 8 },
  { name: "Stitching",          value: 14 },
  { name: "Quality Check",      value: 6 },
  { name: "Trial / Alteration", value: 4 },
  { name: "Ready",              value: 9 },
];

export const activityFeed = [
  { who: "Sunita R.", action: "marked ORD-1043 as Quality Check",            time: "8m ago" },
  { who: "Neha V.",   action: "added new customer Divya Suresh",             time: "22m ago" },
  { who: "Ravi S.",   action: "received 50m fabric from Raymond Mills",      time: "1h ago" },
  { who: "Imran K.",  action: "completed stitching for ORD-1042",            time: "2h ago" },
  { who: "System",    action: "generated invoice INV-2026-0152",             time: "3h ago" },
  { who: "Priya R.",  action: "issued receipt for Tara Krishnan (₹7,552)",   time: "4h ago" },
];

export const measurementTemplates: Record<string, string[]> = {
  Shirt: ["Neck", "Chest", "Waist", "Shoulder", "Sleeve Length", "Armhole", "Shirt Length", "Cuff"],
  Pant: ["Waist", "Hip", "Length", "Thigh", "Knee", "Bottom"],
  Blazer: ["Chest", "Waist", "Shoulder", "Sleeve Length", "Length", "Lapel"],
  Kurta: ["Chest", "Waist", "Shoulder", "Sleeve Length", "Length", "Neck"],
  "Saree Blouse": ["Bust", "Waist", "Shoulder Width", "Sleeve Length", "Blouse Length", "Front Neck Depth"],
  Suit: ["Chest", "Waist", "Hip", "Shoulder", "Sleeve Length", "Jacket Length", "Trouser Length"],
  Sherwani: ["Chest", "Waist", "Hip", "Shoulder", "Sleeve Length", "Length"],
  Lehenga: ["Waist", "Hip", "Length", "Blouse Bust", "Blouse Length"],
  Custom: [],
};

export const profitRecords = orders.slice(0, 24).map((o, i) => {
  const fabricCost = Math.round(o.amount * (0.28 + (i % 5) * 0.015));
  const laborCost  = Math.round(o.amount * (0.22 + (i % 4) * 0.01));
  const overhead   = Math.round(o.amount * 0.08);
  const profit     = o.amount - fabricCost - laborCost - overhead;
  return {
    orderId: o.id, customer: o.customer, garment: o.garment, branch: o.branch,
    revenue: o.amount, fabricCost, laborCost, overhead, profit,
    margin: +(profit / o.amount * 100).toFixed(1),
  };
});

export const branchPerformance = [
  { name: "Bandra Flagship", city: "Mumbai",    orders: 18, revenue: 184500, utilization: 86 },
  { name: "Koramangala",     city: "Bengaluru", orders: 14, revenue: 132800, utilization: 72 },
  { name: "T. Nagar",        city: "Chennai",   orders: 10, revenue:  98400, utilization: 58 },
];

export const demoHighlights = {
  ordersToday:   7,
  deliveryDue:   5,
  revenueToday:  38450,
  activeTailors: 8,
  totalTailors:  11,
};
