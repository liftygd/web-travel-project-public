import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

const Map = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    let points = [];
    let coords = { lng: 0, lat: 0 };

    if (props.points && props.points.length > 0) {
        points = props.points;
    }

    let zoom = props.zoom;
    maptilersdk.config.apiKey = 'MAP_KEY';

    let routeCoords = [];
    let lineColors = ['interpolate', ['linear'], ['line-progress'],];

    useEffect(() => {
        updateMap();
    }, [props.points.length, props.update]);

    function updateMap() {
        if (points && points.length > 0) {
            if (props.canEdit) {
                coords = { lng: points[points.length-1].longitude, lat: points[points.length-1].latitude };
            }
            else {
                coords = { lng: points[0].longitude, lat: points[0].latitude };
            }
        }

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ,
            center: [coords.lng, coords.lat],
            zoom: zoom
        });

        if (points && points.length > 0) {
            for (let i = 0; i < points.length; i++){
                routeCoords.push([points[i].longitude, points[i].latitude]);
                lineColors.push((i + 1) / points.length);
                lineColors.push(`rgb(0, ${124 - i * 10}, ${191 - i * 10})`);

                new maptilersdk.Marker({color: "#007cbf"})
                    .setLngLat([points[i].longitude, points[i].latitude])
                    .addTo(map.current);
            }
        }

        const route = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoords,
                    }
                }
            ]
        };

        map.current.on('load', async function() {
            map.current.addSource('route', {
                type: 'geojson',
                lineMetrics: true,
                data: route
            });

            map.current.addLayer({
                id: 'route',
                source: 'route',
                type: 'line',
                paint: {
                    'line-color': 'rgb(0, 124, 191)',
                    'line-width': 8,
                    'line-gradient': lineColors,
                },
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                }
            });
        });

        if (!props.canEdit) return;

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.current.on('mousemove', async function (e) {
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['Country labels', 'City labels']
            });
            if (features.length <= 0) {
                map.current.getCanvas().style.cursor = '';
                return;
            }

            map.current.getCanvas().style.cursor = 'pointer';
        });

        map.current.on('click', function (e) {
            const features = map.current.queryRenderedFeatures(e.point, {
                layers: ['Country labels', 'City labels']
            });

            let name = "";
            if (features.length > 0) {
                // Limit the number of properties we're displaying for
                // legibility and performance
                var displayProperties = [
                    'type',
                    'properties',
                    'id',
                    'layer',
                    'source',
                    'sourceLayer',
                    'state'
                ];
        
                var displayFeatures = features.map(function (feat) {
                    var displayFeat = {};
                    displayProperties.forEach(function (prop) {
                        displayFeat[prop] = feat[prop];
                    });
                    return displayFeat;
                });

                name = displayFeatures[0].properties.name_int;
            }
            
            points.push({longitude: e.lngLat.lng, latitude: e.lngLat.lat, title: name, description: '', transportMode: 'Walk', date: Date.now(), linkedReview: ''});
            zoom = map.current.getZoom();

            map.current.remove();
            props.onPointsChange(points, zoom);
        });
    }
  
    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    );
}

export default Map;