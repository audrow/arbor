import render from 'dom-serializer'
import type {Document} from 'domhandler'
import {cloneNode, Text} from 'domhandler'
import fs from 'fs'
import gitClone from 'git-clone/promise'
import glob from 'glob'
import {DomUtils, parseDocument} from 'htmlparser2'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import {join} from 'path'
import format from 'xml-formatter'
import log from './logger'
import validateSchema from './utils/validate-schema'
import {ReposFileSchema} from './__schemas__/ReposFile'
import type RepoInfo from './__types__/RepoInfo'
import type ReposFile from './__types__/ReposFile'

const cacheDirectory = join(process.cwd(), '.cache')
const cachedReposFilePath = join(cacheDirectory, 'repos.yaml')
const cachedReposDirectory = join(cacheDirectory, 'repos')
const reposUrl = 'https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos'

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
      log.debug(`Created cache directory: ${cacheDirectory}`)
    },
    async () => log.debug(`Cache directory already exists`),
  )
  await doIfPathDoesNotExist(
    cachedReposFilePath,
    async () => {
      await getReposFile(reposUrl, cachedReposFilePath),
        log.debug(`Downloaded repos file: ${cachedReposFilePath}`)
    },
    async () => log.debug(`Repos file already exists`),
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
        log.info(`Cloned ${ownerAndRepo}`)
      } else {
        log.error(`Unsupported repository type: '${info.type}'`)
        process.exit(1)
      }
    },
    async () => log.debug(`${ownerAndRepo} already exists`),
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

function getMaintainers(packageXml: Document) {
  const maintainers = DomUtils.getElementsByTagName('maintainer', packageXml)
  return maintainers.map((m) => {
    const name = (m.children[0] as Text).data
    const email = m.attribs.email
    return {name, email}
  })
}

function getVersion(packageXml: Document) {
  const version = DomUtils.getElementsByTagName('version', packageXml)[0]
  return (version.children[0] as Text).data
}

function setVersion(packageXml: Document, version: string) {
  const dom = cloneNode(packageXml, true)
  const versionTag = DomUtils.getElementsByTagName('version', dom)
  if (versionTag.length !== 1) {
    throw new Error('Version tag not found')
  } else if (versionTag[0].children.length !== 1) {
    throw new Error('Invalid version text entry')
  }
  ;(versionTag[0].children[0] as Text).data = version
  return dom
}

export function modifyMaintainers(packageXmlPath: string) {
  const packageXml = fs.readFileSync(packageXmlPath, 'utf8')
  console.log(packageXmlPath)
  console.log(packageXml)

  const dom = parseDocument(packageXml)
  console.log(dom)

  const maintainers = DomUtils.getElementsByTagName('maintainer', dom)
  const newMaintainerData = {
    name: 'Audrow Nash',
    email: 'audrow@hey.com',
  }
  const newMaintainer = cloneNode(maintainers[0], true)
  newMaintainer.attribs.email = newMaintainerData.email
  ;(newMaintainer.children[0] as Text).data = newMaintainerData.name

  const newAuthor = cloneNode(maintainers[0], true)
  newAuthor.tagName = 'author'
  const authors = DomUtils.getElementsByTagName('author', dom)
  DomUtils.append(authors[0], newAuthor)

  DomUtils.append(maintainers[1], newMaintainer)
  DomUtils.removeElement(maintainers[1])
  let out = render(dom, {selfClosingTags: true})
  out = format(out, {
    indentation: '  ',
    collapseContent: true,
    whiteSpaceAtEndOfSelfclosingTag: true,
  })
  console.log(out)
}

async function main() {
  await setupCache()

  const reposFile = loadReposFile(cachedReposFilePath)
  Object.entries(reposFile.repositories)
    .slice(0, 2)
    .map(async ([key, info]) => await cloneRepo(key, info))

  // TODO find paths to package xmls
  const packageXmlPaths = glob.sync('**/package.xml', {
    cwd: cachedReposDirectory,
    realpath: true,
  })
  const packageXml = fs.readFileSync(packageXmlPaths[0], 'utf8')
  const dom = parseDocument(packageXml)
  const dom2 = setVersion(dom, '1.0.1')
  console.log(getMaintainers(dom), getVersion(dom), getVersion(dom2))
}

main()
