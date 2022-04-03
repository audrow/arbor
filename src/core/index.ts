import {
  cloneRepo,
  doIfPathDoesNotExist,
  getReposFile,
  loadReposFile,
  setupCache,
} from './cache'
import constants_ from './constants'
import logger_ from './logger'
import {
  getCommitsSinceLastTag,
  getMaintainers,
  getVersion,
  isTagDirty,
} from './ros2-repos'
import {
  getChangeLogPaths,
  getGitPaths,
  getPackageXmlPaths,
  getRepoPaths,
  getSetupPyPaths,
} from './workspace'

export const constants = constants_
export const logger = logger_

export const cache = {
  cloneRepo,
  getReposFile,
  doIfPathDoesNotExist,
  loadReposFile,
  setupCache,
}

export const workspace = {
  getRepoPaths,
  getGitPaths,
  getChangeLogPaths,
  getPackageXmlPaths,
  getSetupPyPaths,
}

export const repos = {
  getVersion,
  getMaintainers,
  getCommitsSinceLastTag,
  isTagDirty,
}

export default {
  constants,
  logger,
  cache,
  workspace,
  repos,
}
