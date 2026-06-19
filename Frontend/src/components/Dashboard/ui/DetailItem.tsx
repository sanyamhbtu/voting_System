
interface DetailItemProps {
    label: string
    value: string
    type?: "text" | "image"
    className?: string
  }
  
  export default function DetailItem({ label, value, type = "text", className = "" }: DetailItemProps) {
    return (
      <div className={`bg-white/[0.04] border border-white/10 rounded-2xl p-4 ${className}`}>
        <h2 className="text-sm font-medium text-cyber-300 mb-2">{label}</h2>
        {type === "text" && <p className="text-white/90">{value}</p>}
        {type === "image" && (
          <div>
            <img src={value || "/placeholder.svg"} alt={label} className="w-full h-48 object-contain rounded-xl" />
          </div>
          //
        )}
      </div>
    )
  }
  
  