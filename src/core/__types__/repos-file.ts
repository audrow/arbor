import RepoInfo from './repo-info'

type ReposFile = {
  repositories: {
    [ownerAndRepo: string]: RepoInfo
  }
}

export default ReposFile
