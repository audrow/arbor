import glob from 'glob'
import constants from './constants'
import {cloneRepo, loadReposFile, setupCache} from './core/cache'
import {getCurrentBranch, getLastTag, isTagDirty} from './core/git'
import PackageXml from './core/package-xml'
import {
  getCommitsSinceLastTag,
  getMaintainers,
  getVersion,
} from './core/ros2-repos'

async function main() {
  await setupCache()

  const reposFile = loadReposFile(constants.cachedReposFilePath)
  Object.entries(reposFile.repositories)
    .slice(0, 2)
    .map(async ([key, info]) => await cloneRepo(key, info))

  const packageXmlPaths = glob.sync('**/package.xml', {
    cwd: constants.cachedReposDirectory,
    realpath: true,
  })
  const packageXml = new PackageXml(packageXmlPaths[0])
  packageXml.setMaintainers([
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
    packageXml.getPackageName(),
    packageXml.getVersion(),
    packageXml.render(),
  )

  const repos = glob.sync('**/.git', {
    cwd: constants.cachedReposDirectory,
    realpath: true,
  })
  const idx = 1
  console.log(
    getCurrentBranch(repos[idx]),
    isTagDirty(repos[idx]),
    getLastTag(repos[idx]),
    getMaintainers(repos[idx]),
    getVersion(repos[idx]),
    await getCommitsSinceLastTag(repos[idx]),
  )
}

main()
