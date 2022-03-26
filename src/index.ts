import fs from 'fs'
import {join} from 'path'
import fetch from 'node-fetch'
import yaml from 'js-yaml'

import type ReposFile from './__types__/ReposFile'

const cacheDirectory = join(process.cwd(), '.cache')
const reposFilePath = join(cacheDirectory, 'repos.yaml')
const reposUrl = 'https://raw.githubusercontent.com/ros2/ros2/master/ros2.repos'

async function getReposFile(reposUrl: string, reposFilePath: string) {
  const data = await fetch(reposUrl)
  const reposText = await data.text()
  fs.writeFileSync(reposFilePath, reposText)
}

async function doIfDoesNotExist(filePath: string, func: () => Promise<void>) {
  if (!fs.existsSync(filePath)) {
    await func()
  }
}

function loadReposFile(reposFilePath: string): ReposFile {
  const text = fs.readFileSync(reposFilePath, 'utf8')
  return yaml.load(text) as ReposFile
}

async function main() {
  doIfDoesNotExist(cacheDirectory, async () => fs.mkdirSync(cacheDirectory))
  doIfDoesNotExist(
    reposFilePath,
    async () => await getReposFile(reposUrl, reposFilePath),
  )
  const reposFile = loadReposFile(reposFilePath)
  console.log(reposFile)
}

main()
