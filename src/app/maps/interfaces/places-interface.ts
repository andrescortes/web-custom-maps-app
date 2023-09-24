export interface Place {
  type:        string;
  query:       string[];
  features:    Feature[];
  attribution: string;
}

export interface Feature {
  id:            string;
  type:          string;
  place_type:    string[];
  relevance:     number;
  properties:    Properties;
  text_es:       string;
  place_name_es: string;
  text:          string;
  place_name:    string;
  center:        number[];
  geometry:      Geometry;
  context:       Context[];
}

export interface Context {
  id:           string;
  mapbox_id:    string;
  text_es:      string;
  text:         string;
  wikidata?:    string;
  short_code?:  string;
  language_es?: Language;
  language?:    Language;
}

export enum Language {
  Es = "es",
}

export interface Geometry {
  type:        string;
  coordinates: number[];
}

export interface Properties {
  accuracy: string;
}
