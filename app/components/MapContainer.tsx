import React, { Component, createRef } from 'react';

import log from 'loglevel';
import { Location } from '../types/GoogleMaps';
import injectGoogleMapsAPI, { GoogleMapsProps } from './hoc/injectGoogleMapsAPI';

import Pano from './Pano';

const mapStyle: React.CSSProperties = {
  height: '40vh',
  width: '100%',
  marginBottom: '20px'
};

type Props = {
  location: Location;
} & GoogleMapsProps;

interface State {
  map: google.maps.Map | undefined;
}

const initialState: State = {
  map: undefined
};

class MapContainer extends Component<Props, State> {
  readonly state: State = initialState;

  private mapRef = createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    this.createMap = this.createMap.bind(this);
  }

  componentDidUpdate() {
    const { location } = this.props;
    const { map } = this.state;

    if (map) {
      map.panTo({ lat: location.position.lat, lng: location.position.lng });
    } else if (this.mapRef) {
      const newmap = this.createMap();
      log.debug(newmap);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(() => ({
        map: newmap
      }));
    }
  }

  private createMap(): google.maps.Map | undefined {
    const { location, googleApi } = this.props;
    try {
      const m = this.mapRef.current;
      const map: google.maps.Map = new googleApi.Map(m, {
        center: location.position,
        zoom: 16
      });

      return map;
      // const coordInfoWindow = new api.InfoWindow();
      // coordInfoWindow.setContent('MIKE!');
      // coordInfoWindow.setPosition(mikeHouse);
      // coordInfoWindow.open(map);
    } catch (e) {
      log.error('Error occurred creating map');
      log.error(e);
      return undefined;
    }
  }

  render() {
    const { location, googleApi, apiIsLoading } = this.props;
    const { map } = this.state;

    if (apiIsLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div style={mapStyle} ref={this.mapRef} />
        <Pano googleApi={googleApi} map={map} location={location} />
      </div>
    );
  }
}

export default injectGoogleMapsAPI(MapContainer);
