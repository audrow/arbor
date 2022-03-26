import fs from 'fs'
import gitClone from 'git-clone/promise'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import {join} from 'path'
import validateSchema from './utils/validate-schema'
import {ReposFileSchema} from './__schemas__/ReposFile'
import type RepoInfo from './__types__/RepoInfo'
import type ReposFile from './__types__/ReposFile'

const cacheDirectory = join(process.cwd(), '.cache')
const reposFilePath = join(cacheDirectory, 'repos.yaml')
const reposUrl = 'https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos'
const cachedReposDirectory = join(cacheDirectory, 'repos')

async function getReposFile(reposUrl: string, reposFilePath: string) {
  const data = await fetch(reposUrl)
  const reposText = await data.text()
  fs.writeFileSync(reposFilePath, reposText)
}

function loadReposFile(reposFilePath: string): ReposFile {
  const text = fs.readFileSync(reposFilePath, 'utf8')
  const reposYaml = yaml.load(text) as ReposFile
  validateSchema<ReposFile>(reposYaml, ReposFileSchema)
  return reposYaml
}

async function setupCache() {
  await doIfPathDoesNotExist(
    cacheDirectory,
    async () => {
      fs.mkdirSync(cacheDirectory)
      console.debug(`Created cache directory: ${cacheDirectory}`)
    },
    async () => console.debug(`Cache directory already exists`),
  )
  await doIfPathDoesNotExist(
    reposFilePath,
    async () => {
      await getReposFile(reposUrl, reposFilePath),
        console.debug(`Downloaded repos file: ${reposFilePath}`)
    },
    async () => console.debug(`Repos file already exists`),
  )
}

async function cloneRepo(ownerAndRepo: string, info: RepoInfo) {
  const [owner, repo] = ownerAndRepo.split('/')
  const repoPath = join(cachedReposDirectory, owner, repo)
  doIfPathDoesNotExist(
    repoPath,
    async () => {
      if (info.type === 'git') {
        await gitClone(info.url, repoPath, {checkout: info.version})
        console.info(`Cloned ${ownerAndRepo}`)
      } else {
        console.error(`Unsupported repository type: '${info.type}'`)
        process.exit(1)
      }
    },
    async () => console.debug(`${ownerAndRepo} already exists`),
  )
}

async function doIfPathDoesNotExist(
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

async function main() {
  await setupCache()

  const reposFile = loadReposFile(reposFilePath)
  Object.entries(reposFile.repositories)
    .slice(0, 2)
    .map(async ([key, info]) => await cloneRepo(key, info))
}

main()
