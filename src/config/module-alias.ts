import * as path from 'node:path'
import moduleAlias from 'module-alias'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const files = path.resolve(__dirname, '../..')

moduleAlias.addAliases({
  '@': path.join(files, '.'),
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
})
