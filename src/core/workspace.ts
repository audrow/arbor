import glob from 'glob'
import {dirname} from 'path'

export function getRepoPaths(path: string) {
  const gitPaths = getGitPaths(path)
  return gitPaths.map((gitPath) => dirname(gitPath))
}
export function getGitPaths(path: string) {
  return getPathsFromGlob('**/.git', path)
}
export function getPackageXmlPaths(path: string) {
  return getPathsFromGlob('**/package.xml', path)
}
export function getSetupPyPaths(path: string) {
  return getPathsFromGlob('**/setup.py', path)
}
export function getChangeLogPaths(path: string) {
  return getPathsFromGlob('**/CHANGELOG.rst', path)
}

function getPathsFromGlob(globString: string, path: string) {
  return glob.sync(globString, {
    cwd: path,
    realpath: true,
  })
}

async function main() {
  const constants = (await import('./constants')).default
  const repoPaths = getRepoPaths(constants.cachedReposDirectory)
  for (const repoPath of repoPaths) {
    console.log('package.xml paths:', getPackageXmlPaths(repoPath))
    console.log('setup.py paths:', getSetupPyPaths(repoPath))
    console.log('changelog paths:', getChangeLogPaths(repoPath))
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
