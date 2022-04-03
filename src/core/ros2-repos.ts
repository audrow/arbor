import glob from 'glob'
import {
  getCommitMessagesSinceLastTag,
  getContributorsSinceLastTag,
  getLastTag,
  isTagDirty as isTagDirty_,
} from './git'
import PackageXml from './package-xml'

export function getVersion(repoPath: string) {
  return getLastTag(repoPath)
}

export function getMaintainers(repoPath: string) {
  const packageXmlPaths = glob.sync('**/package.xml', {
    cwd: repoPath,
    realpath: true,
  })
  const packageXml = new PackageXml(packageXmlPaths[0])
  return packageXml.getMaintainers()
}

export async function isTagDirty(repoPath: string) {
  return await isTagDirty_(repoPath)
}

export async function getCommitsSinceLastTag(repoPath: string) {
  const contributors = await getContributorsSinceLastTag(repoPath)
  const messages = await getCommitMessagesSinceLastTag(repoPath)
  return {
    contributors,
    messages,
  }
}

async function main() {
  const constants = (await import('./constants')).default
  const getRepoPaths = (await import('./workspace')).getRepoPaths
  const repoPaths = getRepoPaths(constants.cachedReposDirectory)
  for (const repoPath of repoPaths) {
    console.log(repoPath)
    console.log('version:', getVersion(repoPath))
    console.log('maintainers:', getMaintainers(repoPath))
    console.log(
      'commits since last tag:',
      await getCommitsSinceLastTag(repoPath),
    )
    console.log('is tag dirty:', await isTagDirty(repoPath))
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
