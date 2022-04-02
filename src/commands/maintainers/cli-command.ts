import {Command} from 'commander'

const maintainersCliCommand: Command = new Command('maintainers')
  .alias('m')
  .description('Manage maintainers')
  .action(() => {
    console.log(`Running maintainer command`)
  })

export default maintainersCliCommand
