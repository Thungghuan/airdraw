import { PluginOption } from 'vite'

export default function (): PluginOption {
  return {
    name: 'airdraw:communication',
    configureServer(server) {
      server.ws.on('airdraw:draw-moving', (data: any) => {
        server.config.logger.info(
          `update points: ${JSON.stringify(data.points)}`
        )
      })
    }
  }
}
