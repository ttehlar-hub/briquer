import { NetlifyDB } from '@netlify/database-dev'
import { spawn } from 'node:child_process'

// Bootstrap only the local emulator. Never connect to or reset a deployed database.
const db = new NetlifyDB({ directory: '.netlify/db' })
try {
  await db.start()
  const applied = await db.applyMigrations('netlify/database/migrations')
  console.log(`Applied ${applied.length} local database migrations.`)
} finally {
  await db.stop()
}

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'dev', '--port', '3000', ...process.argv.slice(2)], {
  stdio: 'inherit',
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}
server.on('exit', (code) => process.exit(code ?? 0))
