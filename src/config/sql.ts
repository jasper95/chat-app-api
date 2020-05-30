import { SqlFunctionTemplate, SqlViewTemplate } from 'types'

export const views: SqlViewTemplate[] = [
  {
    name: 'message_view',
    allowed_fields: {},
    query: `
      select m.*, u.username as sender
        from message m
      left join user u 
        on u.id = m.user_id
    `,
  },
]
export const functions: SqlFunctionTemplate[] = []
