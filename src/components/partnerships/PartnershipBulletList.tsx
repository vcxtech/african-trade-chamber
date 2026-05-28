export function PartnershipBulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-2.5 p-0">
      {items.map((item) => (
        <li key={item} className="relative pl-5 text-base leading-snug text-[#4a4a4a]">
          <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-[#002740]" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}
