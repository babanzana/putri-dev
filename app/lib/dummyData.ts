export type Consumer = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type Admin = {
  name: string;
  email: string;
  role: string;
};

export type Product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
};

export type Order = {
  id: string;
  customer: Consumer;
  status: string;
  total: number;
  paymentProof: string | null;
};

export const consumers: Consumer[] = [
  {
    name: "Adi Pratama",
    email: "adi.pratama@mail.com",
    password: "adi12345",
    phone: "0812-3344-5566",
    address: "Jl. Melati No. 10, Bandung",
  },
  {
    name: "Sinta Lestari",
    email: "sinta.les@mail.com",
    password: "sinta879",
    phone: "0813-7788-9900",
    address: "Perum Griya Asri Blok B2, Bekasi",
  },
  {
    name: "Budi Hartono",
    email: "budi.hartono@mail.com",
    password: "budi4321",
    phone: "0857-2233-8899",
    address: "Jl. Veteran No. 21, Surabaya",
  },
];

export const admins: Admin[] = [
  { name: "Rangga Santoso", email: "admin@sparx.id", role: "Super Admin" },
  { name: "Kiki Syahputra", email: "ops@sparx.id", role: "Finance" },
  { name: "Dewi Kurnia", email: "cs@sparx.id", role: "Customer Support" },
];

export const products: Product[] = [
  {
    name: "Kampas Rem Depan NMax",
    price: 185000,
    stock: 12,
    category: "Brake System",
    status: "Aktif",
  },
  {
    name: "Oli Mesin 10W-40 Synthetic",
    price: 95000,
    stock: 5,
    category: "Oli & Fluids",
    status: "Stok Menipis",
  },
  {
    name: "Busi Iridium NGK CR7EIX",
    price: 145000,
    stock: 30,
    category: "Engine",
    status: "Aktif",
  },
  {
    name: "Rantai Set Vario 125",
    price: 265000,
    stock: 3,
    category: "Drivetrain",
    status: "Stok Menipis",
  },
];

export const orders: Order[] = [
  {
    id: "INV-10293",
    customer: consumers[0],
    status: "Menunggu Pembayaran",
    total: 425000,
    paymentProof: null,
  },
  {
    id: "INV-10294",
    customer: consumers[1],
    status: "Menunggu Verifikasi",
    total: 565000,
    paymentProof: "/dummy/bukti-10294.jpg",
  },
  {
    id: "INV-10295",
    customer: consumers[2],
    status: "Selesai",
    total: 225000,
    paymentProof: "/dummy/bukti-10295.jpg",
  },
];

export const salesSeries = [14, 20, 18, 24, 32, 28, 36];
