import { Shell } from "../components/Shell";
const suppliers = [
  {
    name: "PT Sumber Sparepart",
    address: "Jl. Industri No. 12, Bekasi",
    email: "sales@sumbersparepart.id",
    phone: "0812-8888-1111",
    wa: "0812-8888-1111",
    ig: "@sumbersparepart",
    fb: "facebook.com/sumbersparepart",
  },
  {
    name: "CV Motor Jaya",
    address: "Kawasan Pergudangan A3, Surabaya",
    email: "support@motorjaya.co.id",
    phone: "0813-2222-4444",
    wa: "0813-2222-4444",
    ig: "@motorjaya",
    fb: "facebook.com/motorjaya",
  },
  {
    name: "Ponti Pratama Distribusi",
    address: "Jl. Raya Bogor KM 25, Jakarta Timur",
    email: "partner@pontipratama.id",
    phone: "0817-5555-9999",
    wa: "0817-5555-9999",
    ig: "@pontipratama",
    fb: "facebook.com/pontipratama",
  },
];
export default function ContactsPage() {
  return (
    <Shell active="settings" requiresAuth>
      {" "}
      <div className="space-y-4">
        {" "}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {" "}
          <div>
            {" "}
            <p className="text-sm text-slate-500">
              Kontak supplier & channel
            </p>{" "}
            <h1 className="text-2xl font-semibold">Kontak</h1>{" "}
          </div>{" "}
        </div>{" "}
        <div className="overflow-auto rounded-2xl border border-slate-100 bg-white/90 shadow-sm ring-1 ring-black/5">
          {" "}
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            {" "}
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              {" "}
              <tr>
                {" "}
                <th className="px-4 py-3">Supplier</th>{" "}
                <th className="px-4 py-3">Alamat</th>{" "}
                <th className="px-4 py-3">Email</th>{" "}
                <th className="px-4 py-3">Telepon/WA</th>{" "}
                <th className="px-4 py-3">IG</th>{" "}
                <th className="px-4 py-3">FB</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-slate-100 bg-white">
              {" "}
              {suppliers.map((s) => (
                <tr key={s.name}>
                  {" "}
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {s.name}
                  </td>{" "}
                  <td className="px-4 py-3 text-slate-600">{s.address}</td>{" "}
                  <td className="px-4 py-3 text-slate-600">{s.email}</td>{" "}
                  <td className="px-4 py-3 text-slate-600">
                    {" "}
                    {s.phone} / WA: {s.wa}{" "}
                  </td>{" "}
                  <td className="px-4 py-3 text-slate-600">{s.ig}</td>{" "}
                  <td className="px-4 py-3 text-slate-600">{s.fb}</td>{" "}
                </tr>
              ))}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm ring-1 ring-black/5">
          {" "}
          <p className="text-sm font-semibold text-slate-900">
            Channel komunikasi
          </p>{" "}
          <p className="text-xs text-slate-600">
            {" "}
            Email: support@sparx.id | WA: 0812-1234-5678 | IG: @sparxparts | FB:
            fb.com/sparxparts{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </Shell>
  );
}
