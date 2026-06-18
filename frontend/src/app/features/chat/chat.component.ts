import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { ChatSocketService } from './services/chat-socket.service';
import { InboxChat, ChatMessage, SendMessagePayload, MatchCreatedPayload } from './models/chat.models';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface UsuarioMascota {
  id_mascota: number;
  nombre: string;
}

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageList') messageList!: ElementRef;
  private readonly selectedMatchStorageKey = 'chat_selected_match_id';
  private readonly pendingMessageTimeoutMs = 12000;

  // Estado del componente
  inboxChats: InboxChat[] = [];
  messages: ChatMessage[] = [];
  selectedChat: InboxChat | null = null;
  messageInput: string = '';
  userPets: UsuarioMascota[] = [];
  selectedMascotaId: number | null = null;

  // Estados de carga y error
  loadingInbox = false;
  loadingMessages = false;
  errorInbox: string | null = null;
  errorMessages: string | null = null;

  currentUserId: number | null = null;
  currentMascotaId: number | null = null;
  private readonly apiBaseUrl = 'http://localhost:3000';

  // Control de carrera de condiciones
  private inboxLoadGeneration = 0;

  private destroy$ = new Subject<void>();
  private shouldScroll = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private socketService: ChatSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resolveSessionContext();
    this.socketService.connect();
    this.bootstrapMascotaContext();
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idMatch = Number(params.get('idMatch'));
      if (Number.isInteger(idMatch) && idMatch > 0) {
        this.tryOpenMatch(idMatch);
      }
    });
    this.subscribeToMessages();
    this.subscribeToMatches();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect();
  }

  /**
   * Carga la lista de conversaciones (inbox)
   */
  loadInbox(): void {
    if (!this.currentMascotaId) {
      this.errorInbox = 'No se pudo identificar la mascota activa';
      this.loadingInbox = false;
      return;
    }

    // Incrementar generación para descartar respuestas antiguas
    const currentGeneration = ++this.inboxLoadGeneration;

    // Limpiar inmediatamente el inbox para la nueva mascota
    this.inboxChats = [];
    this.loadingInbox = true;
    this.errorInbox = null;

    console.log(`[Chat] Cargando inbox para mascota ${this.currentMascotaId} (gen ${currentGeneration})`);

    this.chatService
      .getInbox(this.currentMascotaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chats: InboxChat[]) => {
          // Descartar respuesta si es de una generación anterior
          if (currentGeneration !== this.inboxLoadGeneration) {
            console.log(`[Chat] Descartando respuesta antigua para mascota (gen ${currentGeneration}, actual ${this.inboxLoadGeneration})`);
            this.loadingInbox = false;
            return;
          }

          console.log(`[Chat] Inbox cargado: ${chats.length} conversaciones para mascota ${this.currentMascotaId}`);
          this.inboxChats = chats;
          this.syncSelectedChatAfterInboxRefresh();
          const storedMatchId = this.getStoredSelectedMatchId();
          const storedChat = storedMatchId
            ? this.inboxChats.find(chat => chat.match.id_match === storedMatchId) ?? null
            : null;

          if (!this.selectedChat && storedChat) {
            console.log(`[Chat] Restaurando conversación guardada: match_${storedChat.match.id_match}`);
            this.selectChat(storedChat);
          } else if (!this.selectedChat && this.inboxChats.length > 0) {
            const chatMasReciente = this.inboxChats[0];
            console.log(`[Chat] Auto-seleccionando primer chat: match_${chatMasReciente.match.id_match}`);
            this.selectChat(chatMasReciente);
          } else if (this.inboxChats.length === 0) {
            console.log(`[Chat] Inbox vacío para mascota ${this.currentMascotaId}`);
            this.selectedChat = null;
            this.messages = [];
            this.clearStoredSelectedMatchId();
          }
          this.loadingInbox = false;
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          // Descartar error si es de una generación anterior
          if (currentGeneration !== this.inboxLoadGeneration) {
            console.log(`[Chat] Error descartado de generación anterior (gen ${currentGeneration}, actual ${this.inboxLoadGeneration})`);
            this.loadingInbox = false;
            this.cdr.detectChanges();
            return;
          }
          console.error(`[Chat] Error cargando inbox:`, err);
          this.errorInbox = 'No se pudo cargar las conversaciones';
          this.loadingInbox = false;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Selecciona un chat y carga su historial
   */
  selectChat(chat: InboxChat): void {
    console.log(`[Chat] Seleccionando chat: match_${chat.match.id_match}, con ${chat.match.mascota_2.nombre}`);
    this.selectedChat = chat;
    this.persistSelectedChat(chat.match.id_match);
    this.messages = [];
    this.messageInput = '';
    this.errorMessages = null;
    this.loadMessages();
  }

  /**
   * Carga el historial de mensajes del chat seleccionado
   */
  loadMessages(): void {
    if (!this.selectedChat) return;

    console.log(`[Chat] Cargando historial para match ${this.selectedChat.match.id_match}`);

    this.loadingMessages = true;
    this.errorMessages = null;

    this.chatService
      .getHistory(this.selectedChat.match.id_match)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages: ChatMessage[]) => {
          console.log(`[Chat] Historial cargado: ${messages.length} mensajes para match ${this.selectedChat?.match.id_match}`);
          this.messages = messages;
          this.loadingMessages = false;
          this.shouldScroll = true;
          
          // Unirse al chat en socket
          if (this.selectedChat) {
            this.socketService.joinChat(this.selectedChat.match.id_match);
          }
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          console.error('Error cargando mensajes:', err);
          this.errorMessages = 'No se pudo cargar el historial de mensajes';
          this.loadingMessages = false;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Se suscribe a los mensajes en tiempo real
   */
  private subscribeToMessages(): void {
    this.socketService
      .onReceiveMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message: ChatMessage) => {
          const pendingIndex = this.findMatchingPendingMessageIndex(message);

          if (pendingIndex >= 0) {
            this.messages[pendingIndex] = { ...message };
            this.shouldScroll = true;
          } else {
            // Evitar duplicados: no agregar si ya existe el mensaje
            const messageExists = this.messages.some(m => m.id_mensaje === message.id_mensaje);
            if (!messageExists) {
              this.messages.push(message);
              this.shouldScroll = true;
            }
          }

          this.syncSelectedChatPreview(message);
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          console.error('Error en recepción de mensajes:', err);
        }
      });
  }

  /**
   * Se suscribe a nuevos matches para refrescar el inbox
   */
  private subscribeToMatches(): void {
    this.socketService
      .onMatchCreated()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payload: MatchCreatedPayload) => {
          console.log(`[Chat] Nuevo match creado: ${payload.match.id_match} entre mascotas ${payload.match.mascota_1.id_mascota} y ${payload.match.mascota_2.id_mascota}`);
          if (this.isRelevantMatch(payload.match)) {
            console.log(`[Chat] Match relevante para mascota actual, refrescando inbox...`);
            this.refreshInbox();
          }
        },
        error: (err: unknown) => {
          console.error('Error en recepción de matches:', err);
        }
      });
  }

  private refreshInbox(): void {
    console.log(`[Chat] Refrescando inbox para mascota ${this.currentMascotaId}`);
    this.loadInbox();
  }

  private tryOpenMatch(idMatch: number): void {
    const chat = this.inboxChats.find(item => item.match.id_match === idMatch);
    if (chat) {
      this.selectChat(chat);
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        queryParamsHandling: '',
      });
    }
  }

  private bootstrapMascotaContext(): void {
    console.log(`[Chat] Inicializando contexto de mascota. currentMascotaId=${this.currentMascotaId}`);
    this.loadUserPets();
  }

  private loadUserPets(): void {
    if (!this.currentUserId) {
      this.errorInbox = 'No se pudo identificar al usuario activo';
      return;
    }

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.errorInbox = 'No hay sesión activa';
      return;
    }

    console.log(`[Chat] Cargando mascotas del usuario ${this.currentUserId}`);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<UsuarioMascota[] | UsuarioMascota>(`${this.apiBaseUrl}/pets/my-pets`, { headers })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (respuesta) => {
          this.userPets = Array.isArray(respuesta) ? respuesta : [respuesta];

          console.log(`[Chat] Se cargaron ${this.userPets.length} mascotas: [${this.userPets.map(p => `${p.id_mascota}(${p.nombre})`).join(', ')}]`);

          if (this.userPets.length === 0) {
            this.errorInbox = 'No tienes mascotas registradas para abrir el chat';
            return;
          }

          const storedMascotaId = this.currentMascotaId;
          const mascotaPreferida = storedMascotaId
            ? this.userPets.find(pet => pet.id_mascota === storedMascotaId) ?? null
            : null;

          console.log(`[Chat] Mascota preferida: ${mascotaPreferida?.id_mascota ?? 'none'}`);

          // Si tenemos mascota preferida, usarla directamente sin buscar más
          let mascotaSeleccionada: UsuarioMascota;
          if (mascotaPreferida) {
            mascotaSeleccionada = mascotaPreferida;
            console.log(`[Chat] Usando mascota preferida: ${mascotaSeleccionada.id_mascota} (${mascotaSeleccionada.nombre})`);
          } else {
            // Si no, buscar la primera con chats
            console.log(`[Chat] Buscando mascota con chats...`);
            const mascotaConChats = await this.findMascotaWithInbox(this.userPets);
            mascotaSeleccionada = mascotaConChats ?? this.userPets[0];
            console.log(`[Chat] Mascota encontrada: ${mascotaSeleccionada.id_mascota} (${mascotaSeleccionada.nombre})`);
          }

          this.selectedMascotaId = mascotaSeleccionada.id_mascota;
          this.currentMascotaId = mascotaSeleccionada.id_mascota;
          localStorage.setItem('id_mascota_actual', String(mascotaSeleccionada.id_mascota));
          this.loadInbox();
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          console.error('Error cargando mascotas del usuario:', error);
          this.errorInbox = 'No se pudieron cargar tus mascotas';
          this.cdr.detectChanges();
        }
      });
  }

  private async findMascotaWithInbox(pets: UsuarioMascota[]): Promise<UsuarioMascota | null> {
    for (const pet of pets) {
      try {
        const inbox = await firstValueFrom(this.chatService.getInbox(pet.id_mascota));
        if (inbox.length > 0) {
          return pet;
        }
      } catch (error) {
        console.error(`Error verificando inbox de la mascota ${pet.id_mascota}:`, error);
      }
    }

    return null;
  }

  onMascotaChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);

    if (!Number.isInteger(value) || value <= 0) {
      return;
    }

    if (value === this.currentMascotaId && value === this.selectedMascotaId) {
      console.log(`[Chat] Mascota seleccionada sin cambios: ${value}`);
      return;
    }

    console.log(`[Chat] Cambio de mascota: ${this.currentMascotaId} → ${value}`);

    // Limpiar ATOMICAMENTE todo el estado ANTES de actualizar currentMascotaId
    this.selectedChat = null;
    this.clearStoredSelectedMatchId();
    this.messages = [];
    this.messageInput = '';
    this.errorMessages = null;
    this.inboxChats = []; // Limpiar inbox viejo
    this.loadingInbox = true;

    // Ahora actualizar IDs
    this.selectedMascotaId = value;
    this.currentMascotaId = value;
    localStorage.setItem('id_mascota_actual', String(value));

    // Finalmente, cargar el nuevo inbox
    this.loadInbox();
    this.cdr.detectChanges();
  }

  private resolveSessionContext(): void {
    const rawUserId = localStorage.getItem('id_usuario');
    const rawMascotaId = localStorage.getItem('id_mascota_actual');

    this.currentUserId = rawUserId ? Number(rawUserId) : null;
    this.currentMascotaId = rawMascotaId ? Number(rawMascotaId) : null;

    console.log(`[Chat] Sesión resuelta: usuario=${this.currentUserId}, mascota=${this.currentMascotaId}`);
  }

  private isRelevantMatch(match: MatchCreatedPayload['match']): boolean {
    if (!this.currentMascotaId) {
      return false;
    }

    return match.mascota_1.id_mascota === this.currentMascotaId || match.mascota_2.id_mascota === this.currentMascotaId;
  }

  private syncSelectedChatAfterInboxRefresh(): void {
    if (!this.selectedChat) {
      return;
    }

    const refreshed = this.inboxChats.find(chat => chat.match.id_match === this.selectedChat?.match.id_match) ?? null;

    if (!refreshed) {
      this.selectedChat = null;
      this.messages = [];
      return;
    }

    this.selectedChat = refreshed;
  }

  private persistSelectedChat(idMatch: number): void {
    localStorage.setItem(this.selectedMatchStorageKey, String(idMatch));
  }

  private getStoredSelectedMatchId(): number | null {
    const rawValue = localStorage.getItem(this.selectedMatchStorageKey);
    const parsedValue = rawValue ? Number(rawValue) : null;

    return parsedValue && Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
  }

  private clearStoredSelectedMatchId(): void {
    localStorage.removeItem(this.selectedMatchStorageKey);
  }
  /**
   * Envía un mensaje
   */
  sendMessage(): void {
    if (!this.selectedChat || !this.messageInput.trim() || !this.currentUserId) {
      return;
    }

    const contenido = this.messageInput.trim();
    const pendingMessage = this.createPendingMessage(contenido);
    this.messages.push(pendingMessage);
    this.shouldScroll = true;
    this.messageInput = '';
    this.errorMessages = null;
    this.syncSelectedChatPreview(pendingMessage);
    this.cdr.detectChanges();

    const payload: SendMessagePayload = {
      idMatch: this.selectedChat.match.id_match,
      idUsuario: this.currentUserId,
      contenido
    };

    this.socketService.sendMessage(payload);
  }

  /**
   * Maneja la tecla Enter para enviar mensaje
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Comprueba si un mensaje es propio
   */
  isOwnMessage(message: ChatMessage): boolean {
    return this.currentUserId !== null && message.usuario_remitente.id_usuario === this.currentUserId;
  }

  /**
   * Obtiene el nombre a mostrar del remitente o destinatario
   */
  getSenderName(message: ChatMessage): string {
    return message.usuario_remitente.nombres || 'Usuario';
  }

  /**
   * Obtiene el nombre de la otra mascota en el chat
   */
  getOtherPetName(): string {
    if (!this.selectedChat) return '';

    const match = this.selectedChat.match;
    if (this.currentMascotaId && match.mascota_1.id_mascota === this.currentMascotaId) {
      return match.mascota_2.nombre;
    }

    if (this.currentMascotaId && match.mascota_2.id_mascota === this.currentMascotaId) {
      return match.mascota_1.nombre;
    }

    return match.mascota_2.nombre;
  }

  getConversationPetName(chat: InboxChat): string {
    const match = chat.match;

    if (this.currentMascotaId && match.mascota_1.id_mascota === this.currentMascotaId) {
      return match.mascota_2.nombre;
    }

    if (this.currentMascotaId && match.mascota_2.id_mascota === this.currentMascotaId) {
      return match.mascota_1.nombre;
    }

    return match.mascota_2.nombre;
  }

  isPendingMessage(message: ChatMessage): boolean {
    return message.pending === true;
  }
  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }
  }

  private createPendingMessage(contenido: string): ChatMessage {
    const tempId = -Date.now();

    return {
      id_mensaje: tempId,
      contenido,
      fecha_envio: new Date().toISOString(),
      usuario_remitente: {
        id_usuario: this.currentUserId ?? 0,
        nombres: 'Tú'
      },
      pending: true
    };
  }

  private findMatchingPendingMessageIndex(message: ChatMessage): number {
    if (!this.currentUserId || message.usuario_remitente.id_usuario !== this.currentUserId) {
      return -1;
    }

    return this.messages.findIndex(existing => {
      if (!existing.pending) {
        return false;
      }

      return existing.contenido === message.contenido && existing.usuario_remitente.id_usuario === message.usuario_remitente.id_usuario;
    });
  }

  private syncSelectedChatPreview(message: ChatMessage): void {
    if (!this.selectedChat || this.selectedChat.match.id_match !== this.getCurrentSelectedMatchId()) {
      return;
    }

    const updatedLastMessage = {
      id_mensaje: message.id_mensaje,
      contenido: message.contenido,
      fecha_envio: message.fecha_envio,
      usuario_remitente: message.usuario_remitente
    };

    this.selectedChat = {
      ...this.selectedChat,
      lastMessage: updatedLastMessage
    };

    this.inboxChats = this.inboxChats.map(chat =>
      chat.match.id_match === this.selectedChat?.match.id_match
        ? { ...chat, lastMessage: updatedLastMessage }
        : chat
    );
  }

  private getCurrentSelectedMatchId(): number | null {
    return this.selectedChat?.match.id_match ?? null;
  }
  /**
   * Scroll al último mensaje
   */
  private scrollToBottom(): void {
    try {
      if (this.messageList) {
        this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }
}
