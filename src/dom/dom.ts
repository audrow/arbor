import render from 'dom-serializer'
import type {Document} from 'domhandler'
import {cloneNode, Element, Text} from 'domhandler'
import fs from 'fs'
import {DomUtils, parseDocument} from 'htmlparser2'
import format from 'xml-formatter'
import log from '../logger'
import isEqual from '../utils/is-equal'
import {difference, union} from '../utils/sets'
import type People from '../__types__/People'

const MAINTAINER_TAG = 'maintainer'
const AUTHOR_TAG = 'author'
const VERSION_TAG = 'version'
const PACKAGE_NAME_TAG = 'name'

export default class PackageXml {
  dom: Document
  filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
    this.dom = parseDocument(fs.readFileSync(filePath, 'utf8'))
    log.debug(`Loaded package.xml from '${filePath}'`)
  }

  render() {
    log.debug(`Rendering package.xml from '${this.filePath}'`)
    return format(render(this.dom, {selfClosingTags: true}), {
      indentation: '  ',
      collapseContent: true,
      whiteSpaceAtEndOfSelfclosingTag: true,
    })
  }

  getPackageName() {
    return getStringFromTag(this.dom, PACKAGE_NAME_TAG)
  }

  getVersion() {
    return getStringFromTag(this.dom, VERSION_TAG)
  }

  getMaintainers(): People[] {
    return getPeople(this.dom, MAINTAINER_TAG)
  }

  getAuthors(): People[] {
    return getPeople(this.dom, AUTHOR_TAG)
  }

  setVersion(version: string) {
    if (version === this.getVersion()) {
      log.debug(`Version already set to '${version}'`)
      return this
    }
    const dom = cloneNode(this.dom, true)
    const versionTag = getDomElementsByTag(dom, VERSION_TAG)
    ;(versionTag[0].children[0] as Text).data = version
    this.dom = dom
    log.debug(`Set version to '${version}' in ${this.filePath}`)
    return this
  }

  setMaintainers(newMaintainers: People[]) {
    const currentMaintainers = this.getMaintainers()

    if (isEqual(currentMaintainers, newMaintainers)) {
      log.debug(
        `Maintainers already set to '${newMaintainers}' in ${this.filePath}`,
      )
      return this
    }
    const currentAuthors = this.getAuthors()
    const authorsToAdd = difference(
      new Set(currentMaintainers),
      new Set(newMaintainers),
    )
    const newAuthors = [
      ...union(new Set(currentAuthors), new Set(authorsToAdd)),
    ]

    let dom = replacePeopleInDom(this.dom, MAINTAINER_TAG, newMaintainers)
    dom = replacePeopleInDom(dom, AUTHOR_TAG, newAuthors)
    this.dom = dom
    log.debug(
      `Set maintainers to '${newMaintainers
        .map((m) => m.name)
        .join(', ')}' in ${this.filePath}`,
    )
    return this
  }
}

function getStringFromTag(dom: Document, tag: string) {
  const element = getDomElementsByTag(dom, tag)[0]
  return (element.children[0] as Text).data
}

function replacePeopleInDom(dom: Document, tag: string, people: People[]) {
  function setEmailAndName(element: Element, person: People) {
    if (person.email) {
      element.attribs.email = person.email
    } else {
      delete element.attribs.email
    }
    ;(element.children[0] as Text).data = person.name
  }

  people.sort((a, b) => a.name.localeCompare(b.name))

  const clonedDom = cloneNode(dom, true)
  const taggedElements = getDomElementsByTag(clonedDom, tag)
  if (taggedElements.length < 1) {
    throw new Error(`No people found with tag '${tag}'`)
  }
  taggedElements.slice(1).forEach((m) => {
    DomUtils.removeElement(m)
  })
  setEmailAndName(taggedElements[0], people[0])

  people.slice(1).forEach((m) => {
    const newMaintainer = cloneNode(taggedElements[0], true)
    setEmailAndName(newMaintainer, m)
    DomUtils.append(taggedElements[0], newMaintainer)
  })
  return clonedDom
}

function getPeople(dom: Document, tag: string): People[] {
  const people = getDomElementsByTag(dom, tag)
  return people.map((m) => {
    const name = (m.children[0] as Text).data
    const email = m.attribs.email
    return {name, email}
  })
}

function getDomElementsByTag(dom: Document, tag: string) {
  return DomUtils.getElementsByTagName(tag, dom)
}
