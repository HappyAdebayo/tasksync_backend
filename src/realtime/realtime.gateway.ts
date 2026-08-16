import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
@Injectable()
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  private extractUserId(token: string): string | null {
    if (!token) return null;
    try {
      const verified = this.jwtService.verify(token);
      if (verified?.sub || verified?.id) return verified.sub || verified.id;
    } catch {
      try {
        const decoded = this.jwtService.decode(token) as any;
        if (decoded?.sub || decoded?.id) return decoded.sub || decoded.id;
      } catch {
        // Ignore
      }
    }
    return null;
  }

  handleConnection(client: Socket) {
    try {
      const rawToken =
        client.handshake.auth?.token ||
        (client.handshake.headers?.authorization
          ? String(client.handshake.headers.authorization).replace(/^Bearer\s+/i, '')
          : null) ||
        client.handshake.query?.token;

      if (rawToken && typeof rawToken === 'string') {
        const userId = this.extractUserId(rawToken);
        if (userId) {
          const room = `user:${userId}`;
          client.join(room);
          console.log(`[WebSocket] Client ${client.id} joined room ${room} upon handshake.`);
          client.emit('authenticated', { status: 'success', userId, room });
          return;
        }
      }
      console.log(`[WebSocket] Client connected (awaiting auth message): ${client.id}`);
    } catch (err: any) {
      console.log(`[WebSocket] Client ${client.id} handshake error:`, err?.message);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[WebSocket] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      let parsed = data;
      if (typeof data === 'string') {
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = { token: data };
        }
      }

      let userId = parsed?.userId;
      if (!userId && parsed?.token) {
        userId = this.extractUserId(parsed.token);
      }

      if (userId) {
        const room = `user:${userId}`;
        client.join(room);
        console.log(`[WebSocket] Client ${client.id} successfully joined room ${room} via authenticate.`);
        client.emit('authenticated', { status: 'success', userId, room });
      } else {
        console.warn(`[WebSocket] Client ${client.id} authenticate could not extract userId from:`, data);
      }
    } catch (err: any) {
      console.error(`[WebSocket] Authenticate message error for ${client.id}:`, err?.message);
    }
  }

  @SubscribeMessage('join-user')
  handleJoinUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    let userId = typeof data === 'string' ? data : data?.userId;
    if (userId) {
      const room = `user:${userId}`;
      client.join(room);
      console.log(`[WebSocket] Client ${client.id} joined ${room} via join-user.`);
      client.emit('authenticated', { status: 'success', userId, room });
    }
  }

  // ─── Realtime Board Collaboration ──────────────────────────────────────────

  @SubscribeMessage('join-board')
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string },
  ) {
    const boardId = typeof data === 'string' ? data : data?.boardId;
    if (boardId) {
      const room = `board:${boardId}`;
      client.join(room);
      console.log(`[WebSocket] Client ${client.id} joined board room: ${room}`);
      client.emit('board:joined', { boardId, room });
    }
  }

  @SubscribeMessage('leave-board')
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string },
  ) {
    const boardId = typeof data === 'string' ? data : data?.boardId;
    if (boardId) {
      const room = `board:${boardId}`;
      client.leave(room);
      console.log(`[WebSocket] Client ${client.id} left board room: ${room}`);
    }
  }

  @SubscribeMessage('board:drag-pointer')
  handleDragPointer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      boardId: string;
      cardId: string;
      cardTitle: string;
      user: { name: string; color: string; initials: string };
      x: number;
      y: number;
      isDragging: boolean;
    },
  ) {
    if (data?.boardId) {
      const room = `board:${data.boardId}`;
      client.to(room).emit('board:remote-drag-pointer', {
        ...data,
        clientId: client.id,
      });
    }
  }

  @SubscribeMessage('board:drag-end')
  handleDragEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; cardId: string; lists?: any },
  ) {
    if (data?.boardId) {
      const room = `board:${data.boardId}`;
      client.to(room).emit('board:remote-drag-end', {
        ...data,
        clientId: client.id,
      });
    }
  }

  @SubscribeMessage('board:move-card')
  handleMoveCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; lists: any },
  ) {
    if (data?.boardId) {
      const room = `board:${data.boardId}`;
      client.to(room).emit('board:card-moved', data);
    }
  }

  @SubscribeMessage('board:change')
  handleBoardChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { boardId: string; lists: any },
  ) {
    if (data?.boardId) {
      const room = `board:${data.boardId}`;
      client.to(room).emit('board:updated', data);
    }
  }

  @SubscribeMessage('test-message')
  handleTestMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    console.log('Received from client:', message);
    client.emit('test-response', {
      message: 'Hello from NestJS WebSocket!',
    });
  }

  emitToUser(userId: string, event: string, payload: any) {
    const room = `user:${userId}`;
    console.log(`[WebSocket] Emitting "${event}" to room ${room}`);
    this.server.to(room).emit(event, payload);
  }

  emitToBoard(boardId: string, event: string, payload: any) {
    const room = `board:${boardId}`;
    console.log(`[WebSocket] Emitting "${event}" to board room ${room}`);
    this.server.to(room).emit(event, payload);
  }
}