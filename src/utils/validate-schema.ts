import type {JSONSchemaType} from 'ajv'
import Ajv from 'ajv'

export default function validateSchema<T>(
  object: unknown,
  schema: JSONSchemaType<T>,
) {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, object)
  if (!valid) {
    console.error(ajv.errorsText())
    process.exit(1)
  }
}
