type Props = { title: string }

export function InsightsCategoryHeader({ title }: Props) {
  return (
    <section className="bg-[#002740] px-4 py-14 text-center text-white md:py-16">
      <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
    </section>
  )
}
