# RECORDS

## 2022-04-04

What I have is a good start, but I think it needs a redesign. The main change will be that I should have a convenient way to access information on the repos of interest. This should take care of caching them, if it is needed, and then exposing the current information. I am thinking something like the following data structures:

```typescript
type Ros2Repo = {
  path: string
  version: string // function
  isTagDirty: boolean // function
  versionControl: RepoInfo
  packages: {
    [packageName: string]: Ros2Package
  }
}

type Ros2Package = {
  maintainers: People[] // function
  authors: People[] // function
  description: string // function
  license: string // function
  files: {
    packageXml: string
    setupPy?: string
    changeLog?: string
  }
}
```

There are many things that I like about my the current design:

- The core and commands directories are a nice way to organize the program
- I like schema validation
- The package xml class is very nice
- I like the caching setup

The newer setup will just make it easier to pass these data structures to commands, so that I don't have to do very much of the same work of looking for and processing files.
