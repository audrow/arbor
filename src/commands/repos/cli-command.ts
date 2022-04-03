import {Command} from 'commander'
import {constants, repos, workspace} from '../../core/index'

const reposCliCommand: Command = new Command('repos')
  .alias('r')
  .description('Manage repos')

const versionCommand: Command = new Command('version')
  .alias('v')
  .description('Print version')
  .action(() => {
    const repoPaths = workspace.getRepoPaths(constants.cachedReposDirectory)
    const repoVersions = repoPaths.map((repoPath) => {
      return {
        path: repoPath,
        version: repos.getVersion(repoPath),
      }
    })
    console.log(repoVersions)
  })

const maintainersCommand: Command = new Command('maintainers')
  .alias('m')
  .description('Manage maintainers')
  .action(() => {
    const repoPaths = workspace.getRepoPaths(constants.cachedReposDirectory)
    const repoMaintainers = repoPaths.map((repoPath) => {
      const maintainers = repos.getMaintainers(repoPath)
      return {
        path: repoPath,
        maintainers,
      }
    })
    repoMaintainers.forEach((repoMaintainer) => {
      console.log(repoMaintainer.path)
      console.log(repoMaintainer.maintainers)
    })
  })

const needsUpdateCommand: Command = new Command('needs-update')
  .alias('u')
  .description('Print repos that need to be updated')
  .action(async () => {
    const repoPaths = workspace.getRepoPaths(constants.cachedReposDirectory)
    const dirtyPaths: string[] = []
    const cleanPaths: string[] = []
    for (const repoPath of repoPaths) {
      if (await repos.isTagDirty(repoPath)) {
        dirtyPaths.push(repoPath)
      } else {
        cleanPaths.push(repoPath)
      }
    }
    console.log('Dirty repos:')
    console.log(dirtyPaths)
    console.log('Clean repos:')
    console.log(cleanPaths)
  })

reposCliCommand.addCommand(versionCommand)
reposCliCommand.addCommand(maintainersCommand)
reposCliCommand.addCommand(needsUpdateCommand)

export default reposCliCommand
