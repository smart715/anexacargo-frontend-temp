import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AgmMarker, MapsAPILoader } from '@agm/core';
import { SettingService } from 'src/app/service/setting.service';

@Component({
    selector: 'google-map',
    templateUrl: './first-location.component.html',
    styleUrls: ['./first-location.component.scss']
})
export class FirstLocationComponent {
    title: string = 'AGM project';
    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    private geoCoder;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private settingService: SettingService
    ) { }

    ngOnInit() {
        console.log(1231312)
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
        
                this.latitude = place.geometry.location.lat();
                this.longitude = place.geometry.location.lng();
                this.getAddress(this.latitude,this.longitude);
                this.zoom = 12;
                });
            });
        });
        this.settingService.getLocation().then((result) => {
            if (result['length'] != 0) {
                this.latitude = parseFloat(result[0]['latitude']);
                this.longitude = parseFloat(result[0]['longitude']);
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
            } else {
                this.setCurrentLocation();
            }
        })
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    getAddress(latitude, longitude) {
        console.log(latitude, longitude, this.geoCoder)
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
    }
    dragEnded(event) {
        this.latitude = event.latLng.lat();
        this.longitude = event.latLng.lng();
        this.getAddress(this.latitude, this.longitude)
        console.log(this.latitude, this.longitude)
    }
    locationSave() {
        this.settingService.saveLocation({ latitude: this.latitude, longitude: this.longitude }).then((result) => {
            console.log(result)
            if (!result['status']) {
                window.alert('Success');
            } else {
                window.alert('you have a problem in database');
            }
        })
    }
}