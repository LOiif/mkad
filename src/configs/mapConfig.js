export default function getMapConfig() {
  return {
    settings: {
      apiKey: 'bc956cba-4adc-4927-bb69-9e6552e88ff1',
      lang: 'ru_RU',
      coordorder: 'latlong',
      version: '2.1',
    },
    zoom: 10,
    behaviors: [
      'drag',
      'scrollZoom',
      'dblClickZoom',
    ],
    controls: [
      'typeSelector',
      'zoomControl',
    ],
  };
}
