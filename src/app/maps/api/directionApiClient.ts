import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root"
})
export class DirectionApiClient extends HttpClient {
    public baseUrl: string = "https://api.mapbox.com/directions/v5/mapbox/driving";

    constructor(handler: HttpHandler) {
        super(handler);
    }

    public override get<T>(url: string): Observable<T> {
        return super.get<T>(`${this.baseUrl}${url}`, {
            params: {
                alternatives: false,
                geometries: "geojson",
                language: "es",
                overview: "simplified",
                steps: false,
                access_token: environment.mapboxToken,
            }
        });
    }

}
