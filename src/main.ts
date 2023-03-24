import * as core from '@actions/core'
import {deleteFile, listFiles} from './delete'

async function run(): Promise<void> {
  try {
    const workspaceName = core.getInput('workspace-name')
    const apiKey = core.getInput('api-key')
    const file = core.getInput('file')
    const safe = core.getBooleanInput('safe')

    const files = await listFiles(apiKey, workspaceName, file)

    if (files.length > 1 && safe) {
      core.setFailed(
        `Multiple files named ${file} found, it's not safe to proceed.`
      )
    }

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
