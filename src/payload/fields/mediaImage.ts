import type { Field } from 'payload'

type MediaImageOptions = {
  name?: string
  label?: string
  required?: boolean
}

export function mediaImageField({
  name = 'image',
  label = 'Image',
  required = false,
}: MediaImageOptions = {}): Field {
  return {
    name,
    type: 'upload',
    relationTo: 'media',
    label,
    required,
    displayPreview: true,
  }
}

export function imageAltField({
  name = 'imageAlt',
  required = false,
}: { name?: string; required?: boolean } = {}): Field {
  return {
    name,
    type: 'text',
    label: 'Image alt text',
    required,
    admin: {
      description: 'Describe the image for accessibility. Defaults from filename if empty.',
    },
  }
}

/** Legacy URL from WordPress imports — hidden from editors after media library migration. */
export function legacyImageUrlField(name = 'imageUrl'): Field {
  return {
    name,
    type: 'text',
    admin: {
      hidden: true,
      description: 'Legacy import URL; used when no Media item is selected.',
    },
  }
}
