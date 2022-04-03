import {Command} from 'commander'
import packageJson from '../../package.json'

export default class Cli {
  rootCommand: Command
  constructor() {
    this.rootCommand = new Command()
      .name(packageJson.name)
      .description(packageJson.description)
      .version(packageJson.version)
      .showHelpAfterError('(add --help for additional information)')
      .showSuggestionAfterError(true)
      .allowExcessArguments(false)
  }
  addCommand(command: Command) {
    this.rootCommand.addCommand(command)
  }
  process() {
    this.rootCommand.parse(process.argv)
    if (this.rootCommand.args.length === 0) {
      this.rootCommand.help()
    }
  }
}

function main() {
  const newCommand = new Command('say-hi').alias('hi').action(() => {
    console.log('Hi!')
  })
  const cli = new Cli()
  cli.addCommand(newCommand)
  cli.process()
}

if (typeof require !== 'undefined' && require.main === module) {
  main()
}
