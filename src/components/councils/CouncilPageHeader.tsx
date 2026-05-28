type Props = {
  title: string
  subtitle?: string
}

export function CouncilPageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-7 rounded-[15px] bg-[#002740] px-7 py-8 text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
      <h1 className="text-[2rem] font-bold leading-tight text-white">{title}</h1>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-[780px] text-[1.05rem] font-medium leading-relaxed text-white/90">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
