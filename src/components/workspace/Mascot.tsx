import mascot from "@/assets/creto-mascot.png";
export function Mascot({ size = 100, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={mascot}
      alt="Créto, le compagnon Crétoria"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
