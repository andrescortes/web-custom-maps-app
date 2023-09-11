import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map: Map | undefined;

  constructor() { }

  public get map(): Map | undefined {
    return this._map;
  }

  public set map(v: Map | undefined) {
    this._map = v;
  }


  public get isMapReady(): boolean {
    return !!this.map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) {
      throw new Error('Map is not ready');
    }
    this.map?.flyTo({
      zoom: 15,
      center: coords
    });
  }

}
