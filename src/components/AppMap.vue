<template>
  <yandex-map
    :settings="mapConfig.settings"
    :coords="centerCoords"
    :zoom="mapConfig.zoom"
    :behaviors="mapConfig.behaviors"
    :controls="mapConfig.controls"
    @click="onClick"
    @map-was-initialized="mapInit"
  >
    <AppLoader v-if="isRouteLoading"/>
    <ymap-marker
      marker-type="Polygon"
      :coords="mkadCoords"
      marker-id="mkad-area"
    />
    <ymap-marker
      marker-type="Polyline"
      :coords="airRouteCoords"
      marker-id="air-route"
      :marker-stroke="airRouteConfig.markerStroke"
      :options="airRouteConfig.options"
    />
    <ymap-marker
      :coords="markerCoords"
      marker-id="click-marker"
      :hint-content="clickAddress"
    />
  </yandex-map>
</template>

<script>
import { yandexMap, ymapMarker, loadYmap } from 'vue-yandex-maps';
import { getNearCoords } from '@/functions';
import AppLoader from '@/components/AppLoader.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'AppMap',
  components: { AppLoader, yandexMap, ymapMarker },
  data: () => ({}),
  methods: {
    ...mapMutations({
      setIsRouteLoading: 'map/setIsRouteLoading',
      setMapInstance: 'map/setMapInstance',
      setClickAddress: 'map/setClickAddress',
      setLastRoute: 'map/setLastRoute',
      setRoute: 'map/setRoute',
      setCenterCoords: 'map/setCenterCoords',
      setMarkerCoords: 'map/setMarkerCoords',
      setAirRouteCoords: 'map/setAirRouteCoords',
      setLastClick: 'map/setLastClick',
      setAllClicks: 'map/setAllClicks',
    }),
    ...mapActions({
      fetchRoute: 'map/fetchRoute',
    }),
    mapInit(map) {
      this.setMapInstance(map);
    },
    deleteRoutes() {
      if (this.lastRoute) this.mapInstance.geoObjects.remove(this.lastRoute);
      this.setAirRouteCoords([]);
    },
    addRoutes(routeOptions, nearCoords) {
      this.route.options.set(routeOptions);
      this.mapInstance.geoObjects.add(this.route);

      this.setAirRouteCoords([this.markerCoords, nearCoords]);
    },
    async onClick(e) {
      this.setMarkerCoords(e.get('coords'));

      this.deleteRoutes();

      const geoData = await window.ymaps.geocode(this.markerCoords);
      const address = geoData.geoObjects.get(0).properties.get('metaDataProperty')
        .GeocoderMetaData.Address.formatted;
      console.log(`Текущее местополжение: ${address}`);
      this.setClickAddress(address);

      await this.fetchRoute();
      const nearCoords = getNearCoords(this.markerCoords, this.mkadCoords, 1);
      this.addRoutes(this.routeConfig.options, nearCoords[0]);

      const lastClick = {
        coords: this.markerCoords,
        address: this.clickAddress,
      };

      this.setLastClick(lastClick);
      this.setAllClicks([...this.allClicks, lastClick]);

      this.setCenterCoords(e.get('coords'));
      this.setLastRoute(this.route);
    },
  },
  computed: {
    ...mapState({
      mapInstance: (state) => state.map.mapInstance,
      centerCoords: (state) => state.map.centerCoords,
      lastRoute: (state) => state.map.lastRoute,
      route: (state) => state.map.route,
      markerCoords: (state) => state.map.markerCoords,
      airRouteCoords: (state) => state.map.airRouteCoords,
      clickAddress: (state) => state.map.clickAddress,
      mkadCoords: (state) => state.map.mkadCoords,
      mapConfig: (state) => state.map.mapConfig,
      airRouteConfig: (state) => state.map.airRouteConfig,
      routeConfig: (state) => state.map.routeConfig,
      isRouteLoading: (state) => state.map.isRouteLoading,
      lastClick: (state) => state.map.lastClick,
      allClicks: (state) => state.map.allClicks,
    }),
  },
  async mounted() {
    await loadYmap(this.mapConfig.settings);

    if (localStorage.getItem('lastClick')) {
      this.setLastClick(JSON.parse(localStorage.getItem('lastClick')));
      this.setAllClicks(JSON.parse(localStorage.getItem('allClicks')));
    }
  },
  watch: {
    '$store.state.map.lastClick': function (click) {
      localStorage.setItem('lastClick', JSON.stringify(click));
    },
    '$store.state.map.allClicks': function (allClicks) {
      localStorage.setItem('allClicks', JSON.stringify(allClicks));
    },
  },
};
</script>

<style scoped lang="scss">

</style>
