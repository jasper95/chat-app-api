import { Table } from 'types'
import { ADMIN_ROLES } from 'utils/decorators/RouteAccessRoles'

const MESSAGE_TABLE: Table = {
  table_name: 'message',
  list_roles: ADMIN_ROLES,
  columns: [
    {
      column_name: 'text',
      type: 'text',
      required: true,
    },
    {
      column_name: 'user_id',
      type: 'uuid',
      foreign_key: true,
      required: true,
      reference_table: 'user',
      reference_column: 'id',
      on_update: 'CASCADE',
      on_delete: 'CASCADE',
    },
  ],
}

export default MESSAGE_TABLE
