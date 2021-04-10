export type SortSpec = { [field: string]: 1 | -1 }

export type ListArgs = {
  sort?: SortSpec
  limit?: number
  offset?: number
}
