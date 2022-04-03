# TODO

## v1.0.0

- [x] Cache repos file and cloned repositories
- [x] Update and set maintainers and authors
- [ ] Test package.xml functions
- [ ] Make commits and pull requests from Octocat
- [x] Make plugable CLI
- [ ] Point to src directory or repos file
- [ ] Support refreshing cache
- [ ] Get repos that need a release
- [ ] Improve install experience
- [ ] Add CLI autocomplete
- [ ] Create documentation

### Workflows

- Keeping up with maintainer responsibilities
  - Find repos that you're maintaining
    - Help you navigate to them to check issues and status
    - Maybe have a persistent database to keep up with it (YAML with last check)
  - Set maintainer responsibilities for all repos using YAML file
  - Check if all repos have up-to-date maintainers using YAML file
- Making releases
  - Find packages that need a release
  - Go through the commit log to decide on bump size
  - Bump repos
  - Generate changelog
  - Make commit and tag
  - Push
  - Trigger bloom
- Helping merge ROS distro
  - Pull up unprocessed issues and make CLI for handling
- Make Colcon easier to build and test with
  - Kickoff CI for a PR
- Generate repos files
  - Run on CI
  - Select repos and their branches, or grab all

### Additional ideas

- Things that could enable additional features
  - Expose package dependencies
  - Get current repo branches in src
