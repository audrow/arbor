import {Command} from 'commander'

const reposCliCommand: Command = new Command('repos')
  .alias('r')
  .description('Manage repos')
  .action(() => {
    console.log(`Running repos command`)
  })

export default reposCliCommand
