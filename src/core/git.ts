import gitRevSync from 'git-rev-sync'
import simpleGit from 'simple-git'

export function getCurrentBranch(path: string) {
  return gitRevSync.branch(path)
}

export function isTagDirty(path: string) {
  return runInDifferentDirectory(path, gitRevSync.isTagDirty)
}

export function addTag(path: string, tag: string) {
  return simpleGit(path).addTag(tag)
}

export function getLastTag(path: string) {
  return runInDifferentDirectory(path, gitRevSync.tag)
}

function runInDifferentDirectory(path: string, fn: () => void): unknown {
  const currentDir = process.cwd()
  process.chdir(path)
  const out = fn()
  process.chdir(currentDir)
  return out
}
