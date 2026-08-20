import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Promotion, PromotionRequest } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Promotions`;

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }
  getPromotionById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }
  createPromotion(data: PromotionRequest): Observable<string> {
    return this.http.post(this.apiUrl, data, { responseType: 'text' });
  }
  updatePromotion(id: number, data: PromotionRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { responseType: 'text' });
  }
  deletePromotion(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
