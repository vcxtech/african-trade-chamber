import { SmeCouncilPageSection } from '@/components/councils/SmeCouncilPageSection'
import { defaultSmeCouncilPage } from '@/lib/sme-council-defaults'

export const metadata = {
  title: 'SME Council',
  description:
    "The SME Council organises and represents small and medium enterprises within the African Trade Chamber's trade and market integration work.",
}

export default function SmeCouncilPage() {
  return <SmeCouncilPageSection data={defaultSmeCouncilPage} />
}
