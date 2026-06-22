/**
 * Internal: initialize Payload once to trigger db push.
 */
import './load-env.js'

process.env.PAYLOAD_DB_PUSH = 'true'

const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config')

const payload = await getPayload({ config })
await payload.db.destroy?.()
process.exit(0)
