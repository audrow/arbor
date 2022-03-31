import gitRevSync from 'git-rev-sync'
import simpleGit from 'simple-git'
import type People from './__types__/People'

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
  return runInDifferentDirectory(path, gitRevSync.tag) as string
}

export async function getCommitMessagesSinceLastTag(path: string) {
  const lastTag = getLastTag(path)
  const commits = await getCommits(path, lastTag, 'HEAD')
  return commits.all.map((commit) => commit.message)
}

export async function getContributorsSinceLastTag(path: string) {
  const lastTag = getLastTag(path)
  const commits = await getCommits(path, lastTag, 'HEAD')
  return commits.all.map((commit) => {
    const person: People = {
      name: commit.author_name,
      email: commit.author_email,
    }
    return person
  })
}

async function getCommits(path: string, from: string, to: string) {
  return await simpleGit(path).log({to, from})
}

function runInDifferentDirectory(path: string, fn: () => void): unknown {
  const currentDir = process.cwd()
  process.chdir(path)
  const out = fn()
  process.chdir(currentDir)
  return out
}
