import fs from 'fs'
import gitClone from 'git-clone/promise'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import {join} from 'path'
import validateSchema from '../utils/validate-schema'
import constants from './constants'
import log from './logger'
import {ReposFileSchema} from './__schemas__/repos-file'
import type RepoInfo from './__types__/repo-info'
import type ReposFile from './__types__/repos-file'

export async function getReposFile(reposUrl: string, reposFilePath: string) {
  const data = await fetch(reposUrl)
  const reposText = await data.text()
  fs.writeFileSync(reposFilePath, reposText)
}

export function loadReposFile(reposFilePath: string): ReposFile {
  const text = fs.readFileSync(reposFilePath, 'utf8')
  const reposYaml = yaml.load(text) as ReposFile
  validateSchema<ReposFile>(reposYaml, ReposFileSchema)
  return reposYaml
}

export async function setupCache() {
  await doIfPathDoesNotExist(
    constants.cacheDirectory,
    async () => {
      fs.mkdirSync(constants.cacheDirectory)
      log.debug(`Created cache directory: ${constants.cacheDirectory}`)
    },
    async () => log.debug(`Cache directory already exists`),
  )
  await doIfPathDoesNotExist(
    constants.cachedReposFilePath,
    async () => {
      await getReposFile(constants.reposUrl, constants.cachedReposFilePath),
        log.debug(`Downloaded repos file: ${constants.cachedReposFilePath}`)
    },
    async () => log.debug(`Repos file already exists`),
  )
}

export async function cloneRepo(ownerAndRepo: string, info: RepoInfo) {
  const [owner, repo] = ownerAndRepo.split('/')
  const repoPath = join(constants.cachedReposDirectory, owner, repo)
  doIfPathDoesNotExist(
    repoPath,
    async () => {
      if (info.type === 'git') {
        await gitClone(info.url, repoPath, {checkout: info.version})
        log.info(`Cloned ${ownerAndRepo}`)
      } else {
        log.error(`Unsupported repository type: '${info.type}'`)
        process.exit(1)
      }
    },
    async () => log.debug(`${ownerAndRepo} already exists`),
  )
}

export async function doIfPathDoesNotExist(
  filePath: string,
  func: () => Promise<void>,
  otherwiseFunc: () => Promise<void> = async () => undefined,
) {
  if (!fs.existsSync(filePath)) {
    await func()
  } else {
    await otherwiseFunc()
  }
}
