import { Table } from 'types'
import { ADMIN_ROLES } from 'utils/decorators/RouteAccessRoles'

const USER_TABLE: Table = {
  table_name: 'user',
  list_roles: ADMIN_ROLES,
  columns: [
    {
      column_name: 'username',
      type: 'string',
      required: true,
      unique: true,
    },
  ],
}

export default USER_TABLE
