export const isDev = () => !/^prod/i.test(process.env['NODE_ENV'] || 'dev')
