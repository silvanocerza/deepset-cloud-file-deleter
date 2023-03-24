import {deleteFile, listFiles, uploadFile} from '../src/delete'
import {describe, expect, test} from '@jest/globals'
import os from 'os'
import path from 'path'
import fs from 'fs'

const run_if = (condition: boolean) => {
  return {test: condition ? test : xtest}
}

const dCApiKey = process.env.DEEPSET_CLOUD_API_KEY
const dCWorkspace = process.env.DEEPSET_CLOUD_WORKSPACE

const dc_env_vars_are_set = (): boolean => {
  return dCApiKey !== undefined && dCWorkspace !== undefined
}

describe('Upload', () => {
  const testFilesPath = path.join(os.tmpdir(), 'test-files')

  beforeEach(() => {
    fs.rmSync(testFilesPath, {recursive: true, force: true})
    fs.mkdirSync(testFilesPath)
  })

  afterEach(async () => {
    const files = await listFiles(dCApiKey!, dCWorkspace!, '')

    for (const f of files) {
      await deleteFile(dCApiKey!, dCWorkspace!, f.id)
    }
  })

  run_if(dc_env_vars_are_set()).test('Upload file', async () => {
    const testFile = path.join(testFilesPath, 'test1.txt')
    fs.writeFileSync(testFile, 'Some text')
    const fileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      testFile,
      {},
      'KEEP'
    )
    expect(fileID)
  })
})

describe('List', () => {
  afterEach(async () => {
    const files = await listFiles(dCApiKey!, dCWorkspace!, '')

    for (const file of files) {
      await deleteFile(dCApiKey!, dCWorkspace!, file.id)
    }
  })

  run_if(dc_env_vars_are_set()).test(
    'Uploaded files are all listed with no filter',
    async () => {
      const firstTestFile = path.join(
        os.tmpdir(),
        'test-files',
        'first-listed.txt'
      )
      fs.writeFileSync(firstTestFile, 'Some text')
      const firstFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        firstTestFile,
        {},
        'KEEP'
      )
      const secondTestFile = path.join(
        os.tmpdir(),
        'test-files',
        'second-listed.txt'
      )
      fs.writeFileSync(secondTestFile, 'Some text')
      const secondFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        secondTestFile,
        {},
        'KEEP'
      )

      const files = await listFiles(dCApiKey!, dCWorkspace!, '')
      expect(files.length).toBe(2)
      expect(files).toContainEqual({
        id: firstFileID,
        name: 'first-listed.txt'
      })
      expect(files).toContainEqual({
        id: secondFileID,
        name: 'second-listed.txt'
      })
    }
  )

  run_if(dc_env_vars_are_set()).test(
    'Uploaded files are partially listed with filter',
    async () => {
      const firstTestFile = path.join(
        os.tmpdir(),
        'test-files',
        'first-listed.txt'
      )
      fs.writeFileSync(firstTestFile, 'Some text')
      const firstFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        firstTestFile,
        {},
        'KEEP'
      )
      const secondTestFile = path.join(
        os.tmpdir(),
        'test-files',
        'second-listed.txt'
      )
      fs.writeFileSync(secondTestFile, 'Some text')
      const secondFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        secondTestFile,
        {},
        'KEEP'
      )

      let files = await listFiles(dCApiKey!, dCWorkspace!, 'first-listed.txt')
      expect(files.length).toBe(1)
      expect(files).toContainEqual({
        id: firstFileID,
        name: 'first-listed.txt'
      })

      files = await listFiles(dCApiKey!, dCWorkspace!, 'second-listed.txt')
      expect(files.length).toBe(1)
      expect(files).toContainEqual({
        id: secondFileID,
        name: 'second-listed.txt'
      })
    }
  )
})

describe('Delete', () => {
  run_if(dc_env_vars_are_set()).test('Delete existing file', async () => {
    const testFile = path.join(os.tmpdir(), 'test-files', 'todelete.txt')
    fs.writeFileSync(testFile, 'Some text')
    const fileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      testFile,
      {},
      'KEEP'
    )
    expect(fileID)
    await deleteFile(dCApiKey!, dCWorkspace!, fileID)
  })

  run_if(dc_env_vars_are_set()).test('Delete non-existing file', async () => {
    expect(async () => {
      await deleteFile(dCApiKey!, dCWorkspace!, 'random-id')
    }).rejects.toThrow()
  })
})
