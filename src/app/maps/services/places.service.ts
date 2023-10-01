import { Injectable } from '@angular/core';
import { Feature, Place } from '../interfaces/places-interface';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

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

  constructor(
    private readonly placesApi: PlacesApiClient,
    private readonly MapService: MapService
  ) {
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
    if (query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }
    if (!this.userLocation) {
      throw new Error('Location is not ready');
    }

    this.isLoadingPlaces = true;
    let url: string = `/${query}.json`;

    this.placesApi.get<Place>(url, {
      params: {
        proximity: this.userLocation.join(','),
      },
    }).subscribe(({ features }) => {
      this.isLoadingPlaces = false;
      this.places = features;
      this.MapService.createMarkersFromPlaces(this.places, this.userLocation!);
    })
  }

  deletePlaces(): void {
    this.places = [];
  }
}
