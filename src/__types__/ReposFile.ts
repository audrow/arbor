import RepoInfo from './RepoInfo'

type ReposFile = {
  repositories: {
    [ownerAndRepo: string]: RepoInfo
  }
}

export default ReposFile
