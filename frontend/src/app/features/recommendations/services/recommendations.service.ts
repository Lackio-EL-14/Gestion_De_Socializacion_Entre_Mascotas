import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecommendationsResponse } from '../models/recommendations.models';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  private readonly apiBaseUrl = 'https://gestion-de-socializacion-entre-mascotas.onrender.com';

  constructor(private readonly http: HttpClient) {}

  getRecommendations(token: string): Observable<RecommendationsResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<RecommendationsResponse>(
      `${this.apiBaseUrl}/recommendations`,
      { headers }
    );
  }
}
