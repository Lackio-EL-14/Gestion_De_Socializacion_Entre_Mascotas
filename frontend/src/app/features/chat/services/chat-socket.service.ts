import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage, SendMessagePayload, JoinChatPayload, MatchCreatedPayload } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  private readonly socketUrl = 'http://localhost:3000';
  private socket: Socket | null = null;
  private messageReceivedSubject = new Subject<ChatMessage>();
  private matchCreatedSubject = new Subject<MatchCreatedPayload>();
  private currentIdMatch: number | null = null;

  constructor() {}

  /**
   * Conecta el socket al servidor
   */
  connect(): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io(this.socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  /**
   * Desconecta el socket
   */
  disconnect(): void {
    if (this.socket) {
      this.cleanupListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentIdMatch = null;
  }

  /**
   * Se une a un chat específico
   */
  joinChat(idMatch: number): void {
    if (!this.socket) {
      this.connect();
    }

    if (this.currentIdMatch !== null && this.currentIdMatch !== idMatch) {
      this.leaveChat();
    }

    this.currentIdMatch = idMatch;
    const payload: JoinChatPayload = { idMatch };
    this.socket?.emit('joinChat', payload);
  }

  /**
   * Sale del chat actual
   */
  private leaveChat(): void {
    if (this.currentIdMatch !== null) {
      this.socket?.emit('leaveChat', { idMatch: this.currentIdMatch });
    }
  }

  /**
   * Envía un mensaje
   */
  sendMessage(payload: SendMessagePayload): void {
    if (!this.socket) {
      console.error('Socket no está conectado');
      return;
    }
    this.socket.emit('sendMessage', payload);
  }

  /**
   * Obtiene un observable para recibir mensajes
   */
  onReceiveMessage(): Observable<ChatMessage> {
    return this.messageReceivedSubject.asObservable();
  }

  /**
   * Obtiene un observable para nuevos matches
   */
  onMatchCreated(): Observable<MatchCreatedPayload> {
    return this.matchCreatedSubject.asObservable();
  }

  /**
   * Configura los listeners del socket
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('receiveMessage', (message: ChatMessage) => {
      this.messageReceivedSubject.next(message);
    });

    this.socket.on('matchCreated', (payload: MatchCreatedPayload) => {
      this.matchCreatedSubject.next(payload);
    });

    this.socket.on('error', (error) => {
      console.error('Error en socket:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket desconectado');
    });
  }

  /**
   * Limpia los listeners del socket
   */
  private cleanupListeners(): void {
    if (!this.socket) return;

    this.socket.off('receiveMessage');
    this.socket.off('matchCreated');
    this.socket.off('error');
    this.socket.off('disconnect');
  }

  /**
   * Comprueba si el socket está conectado
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
