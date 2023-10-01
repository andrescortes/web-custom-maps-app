import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class PlacesApiClient extends HttpClient {
  public baseUrl: string = "https://api.mapbox.com/geocoding/v5/mapbox.places";

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(url: string, options: {
    params?: HttpParams | {
      [param: string]: string | string[] | number | boolean | ReadonlyArray<string | number | boolean>;
    }
  }): Observable<T> {
    return super.get<T>(`${this.baseUrl}/${url}`, {
      params: {
        limit: "5",
        language: "es",
        access_token: environment.mapboxToken,
        ...options.params
      }
    });
  }

}
