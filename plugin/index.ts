import { PluginOption } from 'vite'

export default function (): PluginOption {
  return {
    name: 'airdraw:communication',
    configureServer(server) {
      server.ws.on('airdraw:draw-moving', ({ points }) => {
        server.ws.send('airdraw:display', { points })
      })
    }
  }
}
