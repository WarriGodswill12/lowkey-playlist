import Image from "next/image"

export default function Logo() {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-lg hover:scale-105 transition-transform">
      <Image
        src="/images/lowkey-lofi-logo.png"
        alt="Lowkey Lofi"
        width={160}
        height={60}
        className="w-32 md:w-40"
        style={{ background: "transparent" }}
      />
    </div>
  )
}
