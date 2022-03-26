import type ReposFile from '../__types__/ReposFile'
import type {JSONSchemaType} from 'ajv'

export const ReposFileSchema: JSONSchemaType<ReposFile> = {
  type: 'object',
  properties: {
    repositories: {
      type: 'object',
      patternProperties: {
        '^.*$': {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['git'],
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
      required: [],
      minProperties: 1,
    },
  },
  required: ['repositories'],
  additionalProperties: false,
}

export default ReposFileSchema
