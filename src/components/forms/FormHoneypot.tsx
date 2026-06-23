export const FORM_HONEYPOT_FIELD = '_website'

export function FormHoneypot() {
  return (
    <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="form-website-hp">Website</label>
      <input
        id="form-website-hp"
        type="text"
        name={FORM_HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
