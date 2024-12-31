import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { EmailProp, ENVs, sendEmail } from './utils/mail'
import { cors } from 'hono/cors'
import { jwt, sign } from 'hono/jwt'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(cors())

app.get('/get-token', async (c) => { 
  const key = c.req.header('Authorization');
  if(!key) {
    return c.json({ message: 'Unauthorized' }, 401)
  }
  const [ _, pwd ] = key.split(' ');
  if(pwd !== env(c).PASSWORD) {
    return c.json({ message: 'Unauthorized' }, 401)
  }
  const token = await sign({ name: 'Webbound' }, env(c).JWT_SECRET as string);
  return c.json({ token });
})


app.use('/mail', async (c, next) => {
  const jwtMiddleware = jwt({
    secret: (c.env as any).JWT_SECRET as string,
  })
  return jwtMiddleware(c, next)
})

app.post('/mail', async (c) => {
  const { name, email, mobile, message } = await c.req.json<EmailProp>();
  const envs = env(c);
  const resp = await sendEmail({ name, email, mobile, message }, envs as any);
  if(resp) {
    return c.json({ message: 'Email sent successfully' })
  }
  else {
    return c.json({ message: 'Email not sent' })
  }

})

export default app
