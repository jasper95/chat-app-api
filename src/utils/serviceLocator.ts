import logger from './logger'
import { ServiceLocator } from 'types'
import sendgrid from '@sendgrid/mail'
import QueryWrapper from 'utils/dbwrapper'
import { schema, database } from 'config'
import S3Client from 'aws-sdk/clients/s3'
import azure from 'azure-storage'
import { createProxy } from './tools'

const DB = createProxy(new QueryWrapper(schema, database))
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
const serviceLocator: ServiceLocator = {
  services: {
    DB,
    knex: DB.knex,
    logger,
  },
  registerService(service_name: string, service: object) {
    if (!this.services[service_name]) {
      this.services[service_name] = service
    }
  },
  get(service_name: string) {
    return this.services[service_name]
  },
}

export default serviceLocator
