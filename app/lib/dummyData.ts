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
  password: string;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  description: string;
  images: string[];
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
  {
    name: "Putri",
    email: "aaaputrides2025@gmail.com",
    role: "Super Admin",
    password: "admin123",
  },
  {
    name: "Kiki Syahputra",
    email: "ops@sparx.id",
    role: "Finance",
    password: "admin123",
  },
  {
    name: "Dewi Kurnia",
    email: "cs@sparx.id",
    role: "Customer Support",
    password: "admin123",
  },
];

export const products: Product[] = [
  {
    slug: "kampas-rem-depan-nmax",
    name: "Kampas Rem Depan NMax",
    price: 185000,
    stock: 12,
    category: "Brake System",
    status: "Aktif",
    description: "Kampas rem OEM material ceramic untuk Yamaha NMax, nyaman untuk harian.",
    images: [
      "https://placehold.co/800x600/1f2937/ffffff.png?text=Kampas+NMax+1",
      "https://placehold.co/800x600/0f172a/ffffff.png?text=Kampas+NMax+2",
      "https://placehold.co/800x600/111827/ffffff.png?text=Kampas+NMax+3",
    ],
  },
  {
    slug: "oli-mesin-10w40-synthetic",
    name: "Oli Mesin 10W-40 Synthetic",
    price: 95000,
    stock: 5,
    category: "Oli & Fluids",
    status: "Stok Menipis",
    description: "Oli full synthetic 10W-40 untuk motor matic, tahan panas dan gesekan.",
    images: [
      "https://placehold.co/800x600/0f172a/ffffff.png?text=Oli+10W40+1",
      "https://placehold.co/800x600/1f2937/ffffff.png?text=Oli+10W40+2",
      "https://placehold.co/800x600/111827/ffffff.png?text=Oli+10W40+3",
    ],
  },
  {
    slug: "busi-iridium-ngk-cr7eix",
    name: "Busi Iridium NGK CR7EIX",
    price: 145000,
    stock: 30,
    category: "Engine",
    status: "Aktif",
    description: "Busi iridium NGK CR7EIX untuk performa pembakaran lebih stabil.",
    images: [
      "https://placehold.co/800x600/0ea5e9/ffffff.png?text=Busi+Iridium+1",
      "https://placehold.co/800x600/0284c7/ffffff.png?text=Busi+Iridium+2",
      "https://placehold.co/800x600/0369a1/ffffff.png?text=Busi+Iridium+3",
    ],
  },
  {
    slug: "rantai-set-vario-125",
    name: "Rantai Set Vario 125",
    price: 265000,
    stock: 3,
    category: "Drivetrain",
    status: "Stok Menipis",
    description: "Satu set rantai dan gear Vario 125, kuat dan awet untuk pemakaian harian.",
    images: [
      "https://placehold.co/800x600/f97316/ffffff.png?text=Rantai+Vario+1",
      "https://placehold.co/800x600/ea580c/ffffff.png?text=Rantai+Vario+2",
      "https://placehold.co/800x600/c2410c/ffffff.png?text=Rantai+Vario+3",
    ],
  },
  {
    slug: "shockbreaker-belakang-mio",
    name: "Shockbreaker Belakang Mio",
    price: 320000,
    stock: 9,
    category: "Suspension",
    status: "Aktif",
    description: "Shockbreaker belakang Mio dengan per merah, nyaman dan stabil.",
    images: [
      "https://placehold.co/800x600/22c55e/ffffff.png?text=Shock+Mio+1",
      "https://placehold.co/800x600/16a34a/ffffff.png?text=Shock+Mio+2",
      "https://placehold.co/800x600/15803d/ffffff.png?text=Shock+Mio+3",
    ],
  },
  {
    slug: "kampas-kopling-set-beat-fi",
    name: "Kampas Kopling Set Beat FI",
    price: 210000,
    stock: 7,
    category: "Transmission",
    status: "Aktif",
    description: "Set kampas kopling Beat FI, ready pasang plug and play.",
    images: [
      "https://placehold.co/800x600/7c3aed/ffffff.png?text=Kopling+Beat+1",
      "https://placehold.co/800x600/6d28d9/ffffff.png?text=Kopling+Beat+2",
      "https://placehold.co/800x600/5b21b6/ffffff.png?text=Kopling+Beat+3",
    ],
  },
  {
    slug: "filter-udara-aerox",
    name: "Filter Udara Aerox",
    price: 75000,
    stock: 18,
    category: "Filter",
    status: "Aktif",
    description: "Filter udara busa Aerox, bisa dicuci dan dipakai ulang.",
    images: [
      "https://placehold.co/800x600/facc15/111827.png?text=Filter+Aerox+1",
      "https://placehold.co/800x600/eab308/111827.png?text=Filter+Aerox+2",
      "https://placehold.co/800x600/ca8a04/111827.png?text=Filter+Aerox+3",
    ],
  },
  {
    slug: "aki-gs-astra-12v-7ah",
    name: "Aki GS Astra 12V-7Ah",
    price: 345000,
    stock: 4,
    category: "Electrical",
    status: "Stok Menipis",
    description: "Aki kering GS Astra 7Ah, cocok untuk motor matic 125-155cc.",
    images: [
      "https://placehold.co/800x600/0ea5e9/111827.png?text=Aki+GS+1",
      "https://placehold.co/800x600/0284c7/111827.png?text=Aki+GS+2",
      "https://placehold.co/800x600/0369a1/111827.png?text=Aki+GS+3",
    ],
  },
  {
    slug: "lampu-led-h4-6000k",
    name: "Lampu LED H4 6000K",
    price: 165000,
    stock: 22,
    category: "Lighting",
    status: "Aktif",
    description: "Lampu LED H4 putih 6000K, hemat daya dan terang fokus.",
    images: [
      "https://placehold.co/800x600/0ea5e9/ffffff.png?text=LED+H4+1",
      "https://placehold.co/800x600/0284c7/ffffff.png?text=LED+H4+2",
      "https://placehold.co/800x600/0369a1/ffffff.png?text=LED+H4+3",
    ],
  },
  {
    slug: "ban-tubeless-90-80-14",
    name: "Ban Tubeless 90/80-14",
    price: 355000,
    stock: 6,
    category: "Tires",
    status: "Aktif",
    description: "Ban tubeless 90/80 ring 14, grip kuat cocok harian dan touring.",
    images: [
      "https://placehold.co/800x600/1d4ed8/ffffff.png?text=Ban+90/80+1",
      "https://placehold.co/800x600/2563eb/ffffff.png?text=Ban+90/80+2",
      "https://placehold.co/800x600/1d4ed8/ffffff.png?text=Ban+90/80+3",
    ],
  },
  {
    slug: "kampas-rem-belakang-beat",
    name: "Kampas Rem Belakang Beat",
    price: 68000,
    stock: 25,
    category: "Brake System",
    status: "Aktif",
    description: "Kanvas rem belakang Beat, bahan semi-metal untuk pengereman pakem.",
    images: [
      "https://placehold.co/800x600/b91c1c/ffffff.png?text=Kampas+Beat+1",
      "https://placehold.co/800x600/c2410c/ffffff.png?text=Kampas+Beat+2",
      "https://placehold.co/800x600/991b1b/ffffff.png?text=Kampas+Beat+3",
    ],
  },
  {
    slug: "handle-rem-cnc-universal",
    name: "Handle Rem CNC Universal",
    price: 175000,
    stock: 14,
    category: "Accessories",
    status: "Aktif",
    description: "Handle rem CNC adjustable, warna hitam emas, plug and play motor matic.",
    images: [
      "https://placehold.co/800x600/0f172a/ffffff.png?text=Handle+CNC+1",
      "https://placehold.co/800x600/1f2937/ffffff.png?text=Handle+CNC+2",
      "https://placehold.co/800x600/111827/ffffff.png?text=Handle+CNC+3",
    ],
  },
  {
    slug: "box-top-case-32l",
    name: "Box Top Case 32L",
    price: 525000,
    stock: 8,
    category: "Accessories",
    status: "Aktif",
    description: "Top case 32 liter dengan bracket universal, kunci ganda.",
    images: [
      "https://placehold.co/800x600/0f172a/ffffff.png?text=Top+Case+32L+1",
      "https://placehold.co/800x600/1f2937/ffffff.png?text=Top+Case+32L+2",
      "https://placehold.co/800x600/111827/ffffff.png?text=Top+Case+32L+3",
    ],
  },
  {
    slug: "cover-motor-waterproof",
    name: "Cover Motor Waterproof",
    price: 120000,
    stock: 16,
    category: "Protection",
    status: "Aktif",
    description: "Sarung motor waterproof dengan lapisan UV, ukuran M-L.",
    images: [
      "https://placehold.co/800x600/0ea5e9/ffffff.png?text=Cover+Motor+1",
      "https://placehold.co/800x600/0284c7/ffffff.png?text=Cover+Motor+2",
      "https://placehold.co/800x600/0369a1/ffffff.png?text=Cover+Motor+3",
    ],
  },
  {
    slug: "helm-half-face-sni",
    name: "Helm Half Face SNI",
    price: 285000,
    stock: 11,
    category: "Safety",
    status: "Aktif",
    description: "Helm half face bersertifikat SNI, kaca flat clear, busa nyaman.",
    images: [
      "https://placehold.co/800x600/374151/ffffff.png?text=Helm+Half+Face+1",
      "https://placehold.co/800x600/1f2937/ffffff.png?text=Helm+Half+Face+2",
      "https://placehold.co/800x600/0f172a/ffffff.png?text=Helm+Half+Face+3",
    ],
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
