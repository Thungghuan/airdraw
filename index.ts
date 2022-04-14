import { networkInterfaces } from 'os'
import { createServer } from 'vite'
import colors from 'picocolors'
import qrcode from 'qrcode-terminal'

async function start() {
  const server = await createServer()

  const info = server.config.logger.info

  info(colors.cyan(`\n  AirDraw / 隔空投画`), {
    clear: !server.config.logger.hasWarned
  })

  await server.listen()

  info(colors.gray('\n  Server running at:\n'))

  const urls = Object.values(networkInterfaces())
    .flatMap((nInterface) => nInterface ?? [])
    .filter((detail) => detail && detail.address && detail.family === 'IPv4')
    .map((detail) => {
      const base = detail.address.includes('127.0.0.1') ? '/display/' : '/'

      return {
        host: detail.address,
        base
      }
    })

  urls.forEach((url) => {
    const type = url.host.includes('127.0.0.1') ? 'Display:  ' : 'Drawing:  '
    info(
      `  > ${type} ${colors.green(
        `http://${url.host}:${colors.bold('3333')}${url.base}`
      )}`
    )
  })

  info('\n\n  You can scan the qrcode to draw directly!\n')
  const drawUrl = urls.filter((url) => !url.host.includes('127.0.0.1'))[0]

  qrcode.generate(
    `http://${drawUrl.host}:3333${drawUrl.base}`,
    { small: true },
    (qrcode) => {
      console.log(
        qrcode
          .split('\n')
          .map((line) => '          ' + line)
          .join('\n')
      )
    }
  )
}

start()
