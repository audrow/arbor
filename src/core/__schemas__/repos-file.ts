import type {JSONSchemaType} from 'ajv'
import type ReposFile from '../__types__/repos-file'

export const ReposFileSchema: JSONSchemaType<ReposFile> = {
  type: 'object',
  properties: {
    repositories: {
      type: 'object',
      patternProperties: {
        '^.*/.*$': {
          type: 'object',
          properties: {
            type: {
              type: 'string',
            },
            url: {
              type: 'string',
            },
            version: {
              type: 'string',
            },
          },
          required: ['type', 'url', 'version'],
          additionalProperties: false,
        },
      },
      additionalProperties: false,
      required: [],
      minProperties: 1,
    },
  },
  required: ['repositories'],
  additionalProperties: false,
}

export default ReposFileSchema
