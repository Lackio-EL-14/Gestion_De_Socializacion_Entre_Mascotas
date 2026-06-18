import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InboxChat, ChatMessage } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiBaseUrl = 'http://localhost:3000/messages';

  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene la lista de conversaciones activas (inbox) para una mascota
   */
  getInbox(idMascota: number): Observable<InboxChat[]> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    return this.http.get<InboxChat[]>(`${this.apiBaseUrl}/inbox/${idMascota}`, {
      params,
    });
  }

  /**
   * Obtiene el historial de mensajes de un match específico
   */
  getHistory(idMatch: number): Observable<ChatMessage[]> {
    const params = new HttpParams().set('_ts', Date.now().toString());
    return this.http.get<ChatMessage[]>(`${this.apiBaseUrl}/history/${idMatch}`, {
      params,
    });
  }
}
