import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import Mapboxgl from 'mapbox-gl';

Mapboxgl.accessToken = 'pk.eyJ1IjoicmlweHkiLCJhIjoiY2xsOHBrbTN2MHk3aDN0bWd0djdhMmc4biJ9.rHiltVLpmWmaBd3qWGzWbQ';

if(!navigator.geolocation){
  alert('Geolocation is not supported by your browser');
  throw new Error('Geolocation is not supported by your browser');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
