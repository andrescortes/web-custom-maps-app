import { PlacesService } from '../../services';
import { MapService } from './../../services/map.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(
    private readonly mapService: MapService,
    private readonly placesService: PlacesService
  ) {

  }

  goToMyLocation() {
    if (!this.placesService.userLocation) {
      throw new Error('Location is not ready');
    }

    this.mapService.flyTo(this.placesService.userLocation);
  }
}
