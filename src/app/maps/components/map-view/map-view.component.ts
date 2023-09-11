import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv') divMap!: ElementRef;

  constructor(
    private readonly placesService: PlacesService,
    private readonly mapService: MapService
    ) {
    console.log(this.placesService.userLocation);


  }
  ngAfterViewInit(): void {
    if (!this.placesService.userLocation) {
      throw new Error('Location is not ready');
    }
    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    const popup = new Popup()
      .setHTML(`<h6>You are here</h6>`);

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.map = map;
  }
}
