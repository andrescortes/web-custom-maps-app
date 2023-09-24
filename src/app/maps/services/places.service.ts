import { Injectable } from '@angular/core';
import { Feature, Place } from '../interfaces/places-interface';
import { PlacesApiClient } from '../api';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(private readonly httpCLient: PlacesApiClient) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve([coords.longitude, coords.latitude])
        },
        (err) => {
          alert('Not allowed to access your location');
          console.log(err);
          reject();
        },
      );
    });
  }

  getPlacesByQuery(query: string = ''): void {
    if (!this.userLocation) return;

    this.isLoadingPlaces = true;
    let url: string = `/${query}.json`;

    this.httpCLient.get<Place>(url, {
      params: {
        proximity: this.userLocation.join(','),
      },
    }).subscribe(({ features }) => {
      this.isLoadingPlaces = false;
      this.places = features;
    })
  }
}
