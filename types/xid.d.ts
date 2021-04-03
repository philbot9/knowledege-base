declare module 'xid' {
  export function generateId(): string
  export function validate(id: string)
  export function normalize(id: string): string
}
