import xid from 'xid'

export type ID = string

export function generateId(): ID {
  return xid.generateId()
}

export function validate(id: ID) {
  return xid.validate(id)
}

export function normalize(id: string): ID {
  return xid.normalize(id)
}
