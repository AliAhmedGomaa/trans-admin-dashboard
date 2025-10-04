import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICar } from '../../shared/interfaces/car.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(private http: HttpClient) { }
  currentCar: ICar | null = null;

  getCars(): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars`).pipe(map(res => res.data));
  }

  getCar(id: string): Observable<ICar> {
    return this.http.get<ICar>(`${environment.baseUrl}/cars/${id}`);
  }

  getCarByCategory(category: string): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?category=${category}`).pipe(map(res => res.data));
  }

  getCarByBrand(brand: string): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?brand=${brand}`).pipe(map(res => res.data));
  }

  getCarByModel(model: string): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?model=${model}`).pipe(map(res => res.data));
  }

  getCarByPrice(price: number): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?price=${price}`).pipe(map(res => res.data));
  }

  getCarByColor(color: string): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?color=${color}`).pipe(map(res => res.data));
  }

  getCarByYear(year: number): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?year=${year}`).pipe(map(res => res.data));
  }

  getHomePageCars(): Observable<ICar[]> {
    return this.http.get<{ data: ICar[] }>(`${environment.baseUrl}/cars?limit=6`).pipe(map(res => res.data));
  }

  createBooking(booking: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/bookings`, booking);
  }

  setCurrentCar(car: ICar) {
    this.currentCar = car;
  }

  getCurrentCar(): ICar | null {
    return this.currentCar;
  }

}