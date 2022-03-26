type ReposFile = {
  repositories: {
    [ownerAndRepo: string]: {
      type: 'git'
      url: string
      version: string
    }
  }
}

export default ReposFile
