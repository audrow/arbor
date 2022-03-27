import glob from 'glob'
import constants from './constants'
import {cloneRepo, loadReposFile, setupCache} from './core/cache'
import PackageXml from './core/package-xml'

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
}

main()
