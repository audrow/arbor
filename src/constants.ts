import {join} from 'path'

export const cacheDirectory = join(process.cwd(), '.arbor')
export const cachedReposFilePath = join(cacheDirectory, 'repos.yaml')
export const cachedReposDirectory = join(cacheDirectory, 'repos')
export const reposUrl =
  'https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos'
export const debugLevel = 'info'

export default {
  cacheDirectory,
  cachedReposFilePath,
  cachedReposDirectory,
  reposUrl,
  debugLevel,
}
