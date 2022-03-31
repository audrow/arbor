import glob from 'glob'
import {dirname} from 'path'
import {
  getCommitMessagesSinceLastTag,
  getContributorsSinceLastTag,
  getLastTag,
} from './git'
import PackageXml from './package-xml'

export function getVersion(gitPath: string) {
  return getLastTag(dirname(gitPath))
}

export function getMaintainers(gitPath: string) {
  const directory = dirname(gitPath)
  const packageXmlPaths = glob.sync('**/package.xml', {
    cwd: directory,
    realpath: true,
  })
  const packageXml = new PackageXml(packageXmlPaths[0])
  return packageXml.getMaintainers()
}

export async function getCommitsSinceLastTag(gitPath: string) {
  const directory = dirname(gitPath)
  const contributors = await getContributorsSinceLastTag(directory)
  const messages = await getCommitMessagesSinceLastTag(directory)
  return {
    contributors,
    messages,
  }
}
