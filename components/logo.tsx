import Image from "next/image"

export default function Logo() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Image
        src="/images/lowkey-lofi-logo.png"
        alt="Lowkey Lofi"
        width={160}
        height={160}
        className="rounded-lg hover:scale-105 transition-transform w-32 h-32 md:w-40 md:h-40"
        style={{ background: "transparent" }}
      />
    </div>
  )
}
