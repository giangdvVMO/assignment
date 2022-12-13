import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from './api/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GateGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('msgToClient', client, payload);
  }

  @SubscribeMessage('msgToSignin')
  handleMessageA(client: Socket, payload: any): void {
    console.log('payload', payload);
    this.userService.update(payload.id, { socket_id: client.id });
    this.logger.log(`produce:`);
  }

  @SubscribeMessage('resetSocket')
  handleMessageReset(client: Socket, payload: any): void {
    console.log('payload', payload);
    this.userService.update(payload.id, { socket_id: client.id });
    this.logger.log(`reset:`);
  }

  @SubscribeMessage('sendNoti')
  async handleMessageNoti(client: Socket, payload: any) {
    console.log('payload-noti', payload);
    const userReceive = await this.userService.findOneByCondition({
      _id: payload.receive,
    });
    this.logger.log(userReceive);
    this.server
      .to(userReceive.socket_id)
      .emit('receiveNoti', 'Bạn có thông báo mới');
    this.logger.log(`noti:`);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
