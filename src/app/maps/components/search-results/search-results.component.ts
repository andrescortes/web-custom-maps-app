import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places-interface';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {
  public selectId: string = '';

  constructor(
    private readonly placesService: PlacesService,
    private readonly mapService: MapService
  ) { }

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature): void {
    this.selectId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature): void {
    const origin = this.placesService.userLocation;
    if (!origin) {
      throw new Error('Location is not ready');
    }
    this.placesService.deletePlaces();
    const destination = place.center as [number, number];
    this.mapService.getRouteBetweenPoints(origin, destination);
  }

}
