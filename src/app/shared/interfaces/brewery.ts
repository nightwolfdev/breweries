import { FormControl } from "@angular/forms";

export interface Brewery {
    address_1: string;
    address_2: string;
    address_3: string;
    brewery_type: string;
    city: string;
    country: string;
    favorite: boolean;
    id: string;
    latitude: string;
    longitude: string;
    name: string;
    phone: string;
    postal_code: string;
    state: string;
    state_province: string;
    street: string;
    website_url: string;
}

export interface SearchCriteria {
    brewery_type?: string;
    city?: string;
    dist?: string;
    name?: string;
    state?: string;
}

export interface SearchForm {
    brewery_type: FormControl<string | null>;
    city: FormControl<string | null>;
    name: FormControl<string>;
    state: FormControl<string | null>;
}

export interface TypeDescription {
    description: string;
    id: string;
}
