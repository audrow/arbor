import gitRevSync from 'git-rev-sync'
import simpleGit from 'simple-git'
import type People from './__types__/person'

export function getCurrentBranch(path: string) {
  return gitRevSync.branch(path)
}

export function isTagDirty(path: string) {
  return runInDifferentDirectory(path, gitRevSync.isTagDirty) as boolean
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

async function main() {
  const constants = (await import('./constants')).default
  const getRepoPaths = (await import('./workspace')).getRepoPaths
  const repoPaths = getRepoPaths(constants.cachedReposDirectory)
  for (const repoPath of repoPaths) {
    console.log(repoPath)
    console.log('branch:', getCurrentBranch(repoPath))
    console.log('is tag dirty:', isTagDirty(repoPath))
    console.log('last tag:', getLastTag(repoPath))
    console.log(
      'commit messages since last tag:',
      await getCommitMessagesSinceLastTag(repoPath),
    )
    console.log(
      'contributors since last tag:',
      await getContributorsSinceLastTag(repoPath),
    )
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
