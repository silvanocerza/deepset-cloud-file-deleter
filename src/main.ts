import * as core from '@actions/core'
import {deleteFile, listFiles} from './delete'

async function run(): Promise<void> {
  try {
    const workspaceName = core.getInput('workspace-name')
    const apiKey = core.getInput('api-key')
    const file = core.getInput('file')

    const files = await listFiles(apiKey, workspaceName, file)

    for (const f of files) {
      await deleteFile(apiKey, workspaceName, f.id)
      core.info(`Deleted file named ${f.name} with ID: ${f.id}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
