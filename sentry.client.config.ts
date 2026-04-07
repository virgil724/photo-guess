import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: 'https://b771bec1d9af1cce6df3cde4fb6871e5@o4509485649756160.ingest.us.sentry.io/4511178127572992',
  tracesSampleRate: 1.0,
})
