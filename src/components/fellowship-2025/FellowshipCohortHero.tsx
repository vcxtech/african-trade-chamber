type FellowshipCohortHeroProps = {
  title: string
  subtitle: string
  imageUrl: string
}

export function FellowshipCohortHero({ title, subtitle, imageUrl }: FellowshipCohortHeroProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-[18px] pb-10 pt-7 md:px-8">
      <div
        className="flex min-h-[270px] flex-col justify-center overflow-hidden rounded-[18px] px-7 py-[clamp(60px,10vw,96px)] text-center text-white shadow-[0_14px_34px_rgba(2,6,23,0.16)] md:min-h-[270px]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 39, 64, 0.72) 0%, rgba(0, 39, 64, 0.78) 100%), url('${imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        <h1 className="mx-auto mb-3 max-w-[900px] text-[clamp(2rem,4.4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">
          {title}
        </h1>
        <p className="mx-auto max-w-[760px] text-[clamp(1rem,1.8vw,1.35rem)] font-normal opacity-92">
          {subtitle}
        </p>
      </div>

      <p className="relative mt-[52px] block w-full text-center text-[clamp(2.2rem,5.2vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#002740] before:mx-auto before:mb-[18px] before:block before:h-1 before:w-[92px] before:rounded-full before:bg-gradient-to-r before:from-[#e6b422] before:via-[#f5c518] before:to-[#e6b422] md:mt-[52px]">
        The Fellows
      </p>
    </div>
  )
}
