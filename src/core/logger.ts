import pino from 'pino'
import {debugLevel} from '../config'

const logger = pino({
  level: process.env.LOG_LEVEL || debugLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export default logger
