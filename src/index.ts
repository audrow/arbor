import render from 'dom-serializer'
import type {Document} from 'domhandler'
import {cloneNode, Element, Text} from 'domhandler'
import fs from 'fs'
import gitClone from 'git-clone/promise'
import glob from 'glob'
import {DomUtils, parseDocument} from 'htmlparser2'
import yaml from 'js-yaml'
import fetch from 'node-fetch'
import {join} from 'path'
import format from 'xml-formatter'
import log from './logger'
import {difference, union} from './utils/sets'
import validateSchema from './utils/validate-schema'
import {ReposFileSchema} from './__schemas__/ReposFile'
import type People from './__types__/People'
import type RepoInfo from './__types__/RepoInfo'
import type ReposFile from './__types__/ReposFile'

const cacheDirectory = join(process.cwd(), '.cache')
const cachedReposFilePath = join(cacheDirectory, 'repos.yaml')
const cachedReposDirectory = join(cacheDirectory, 'repos')
const reposUrl = 'https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos'

const MAINTAINER_TAG = 'maintainer'
const AUTHOR_TAG = 'author'

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

function getMaintainers(packageXml: Document): People[] {
  return getPeople(packageXml, 'maintainer')
}

function getAuthors(packageXml: Document): People[] {
  return getPeople(packageXml, 'author')
}

function getPeople(packageXml: Document, tag: string): People[] {
  const people = getDomElementByTag(packageXml, tag)
  return people.map((m) => {
    const name = (m.children[0] as Text).data
    const email = m.attribs.email
    return {name, email}
  })
}

function getDomElementByTag(dom: Document, tag: string) {
  return DomUtils.getElementsByTagName(tag, dom)
}

export function getVersion(packageXml: Document) {
  const version = DomUtils.getElementsByTagName('version', packageXml)[0]
  return (version.children[0] as Text).data
}

export function setVersion(packageXml: Document, version: string) {
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

export function setMaintainers(packageXml: Document, newMaintainers: People[]) {
  const currentMaintainers = getMaintainers(packageXml)
  const currentAuthors = getAuthors(packageXml)
  const authorsToAdd = difference(
    new Set(currentMaintainers),
    new Set(newMaintainers),
  )
  const newAuthors = [...union(new Set(currentAuthors), new Set(authorsToAdd))]

  let outPackageXml = replacePeopleInDom(
    packageXml,
    MAINTAINER_TAG,
    newMaintainers,
  )
  outPackageXml = replacePeopleInDom(outPackageXml, AUTHOR_TAG, newAuthors)

  return outPackageXml
}

function replacePeopleInDom(dom: Document, tag: string, people: People[]) {
  function setEmailAndName(element: Element, person: People) {
    if (person.email) {
      element.attribs.email = person.email
    } else {
      delete element.attribs.email
    }
    ;(element.children[0] as Text).data = person.name
  }

  people.sort((a, b) => a.name.localeCompare(b.name))

  const clonedDom = cloneNode(dom, true)
  const taggedElements = getDomElementByTag(clonedDom, tag)
  if (taggedElements.length < 1) {
    throw new Error('No maintainers found')
  }
  taggedElements.slice(1).forEach((m) => {
    DomUtils.removeElement(m)
  })
  setEmailAndName(taggedElements[0], people[0])

  people.slice(1).forEach((m) => {
    const newMaintainer = cloneNode(taggedElements[0], true)
    setEmailAndName(newMaintainer, m)
    DomUtils.append(taggedElements[0], newMaintainer)
  })
  return clonedDom
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
  const dom3 = setMaintainers(dom, [
    {
      name: 'Audrow Nash',
      email: 'audrow@hey.com',
    },
    {
      name: 'Bob Dylan',
    },
    {
      name: 'Dirk Thomas',
    },
  ])
  console.log(
    format(render(dom3, {selfClosingTags: true}), {
      indentation: '  ',
      collapseContent: true,
      whiteSpaceAtEndOfSelfclosingTag: true,
    }),
  )
}

main()
