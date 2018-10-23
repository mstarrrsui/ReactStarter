import React, { Component, createRef } from 'react';
import { Position, POV } from '../types/GoogleMaps';

import log from 'loglevel';

interface Props {
  googleApi: any;
  style: React.CSSProperties;
  location: {
    position: Position;
    pov: POV;
  };
  map: any;
}

export default class Pano extends Component<Props> {
  private panoRef = createRef<HTMLDivElement>();

  public componentDidUpdate() {
    log.debug('Pano - component did update!!');
    if (this.props.map) {
      this.createPano();
    }
  }

  public render() {
    return <div style={this.props.style} ref={this.panoRef} />;
  }

  private createPano() {
    const { location, map } = this.props;
    try {
      const panoDiv = this.panoRef.current;
      const panorama = new this.props.googleApi.StreetViewPanorama(panoDiv, {
        position: location.position,
        pov: {
          heading: location.pov.heading,
          pitch: location.pov.pitch,
          zoom: 1
        }
      });
      map.setStreetView(panorama);
    } catch (e) {
      log.error('Error occurred creating pano');
      log.error(e);
    }
  }
}
