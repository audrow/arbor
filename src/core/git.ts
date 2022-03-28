import gitRevSync from 'git-rev-sync'
import simpleGit from 'simple-git'

export function getCurrentBranch(path: string) {
  return gitRevSync.branch(path)
}

export function addTag(path: string, tag: string) {
  return simpleGit(path).addTag(tag)
}
