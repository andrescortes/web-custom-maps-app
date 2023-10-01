import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places-interface';
import { DirectionApiClient } from '../api';
import { Direction, Route } from '../interfaces/direction.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _map: Map | undefined;
  private _markers: Marker[] = [];

  constructor(
    private readonly directionApiClient: DirectionApiClient,

  ) { }

  public get map(): Map | undefined {
    return this._map;
  }

  public set map(v: Map | undefined) {
    this._map = v;
  }

  public get isMapReady(): boolean {
    return !!this.map;
  }

  public get markers(): Marker[] {
    return this._markers;
  }

  public set markers(v: Marker[]) {
    this._markers = v;
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

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this._map) {
      throw new Error('Map is not ready');
    }

    this._markers.forEach(marker => marker.remove());
    const newMarkers: Marker[] = [];
    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
        .setHTML(`<h6>${place.text_es}</h6>
      <p></p>${place.place_name_es}</p>
      `
        );
      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this._map);
      newMarkers.push(marker);
    }
    this._markers = newMarkers;
    if (places.length === 0) return;

    const bounds: LngLatBounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this._map.fitBounds(bounds, {
      padding: 200,
    });
  }

  getRouteBetweenPoints(origin: [number, number], destination: [number, number]) {
    this.directionApiClient.get<Direction>(`/${origin.join(',')};${destination.join(',')}`)
      .subscribe((direction: Direction) => this.drawPolyLine(direction.routes[0]));
  }

  private drawPolyLine(route: Route): void {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });
    if (!this._map) {
      throw new Error('Map is not ready');
    }
    const coords: number[][] = route.geometry.coordinates;

    const bounds: LngLatBounds = new LngLatBounds();

    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this._map.fitBounds(bounds, {
      padding: 200,
    });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      }
    }

    if (this._map.getLayer('RouteString')) {
      this._map.removeLayer('RouteString');
      this._map.removeSource('RouteString');
    }

    this._map.addSource('RouteString', sourceData);

    this._map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
        'line-opacity': 0.75,
      },
    });

  }

}
