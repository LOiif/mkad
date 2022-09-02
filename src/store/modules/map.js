import getMkadCoords from '@/data/coords';
import getMapConfig from '@/configs/mapConfig';
import getAirRouteConfig from '@/configs/airRouteConfig';
import getRouteConfig from '@/configs/routeConfig';
import { getMinLengthRoute } from '@/functions';

export default () => ({
  state: () => ({
    mapInstance: null,
    centerCoords: [
      55.753960,
      37.620393,
    ],
    lastClick: null,
    allClicks: [],
    lastRoute: null,
    route: null,
    markerCoords: [],
    airRouteCoords: [],
    clickAddress: '',
    mkadCoords: getMkadCoords(),
    mapConfig: getMapConfig(),
    airRouteConfig: getAirRouteConfig(),
    routeConfig: getRouteConfig(),
    isRouteLoading: false,
  }),
  mutations: {
    setIsRouteLoading(state, bool) {
      state.isRouteLoading = bool;
    },
    setMapInstance(state, instance) {
      state.mapInstance = instance;
    },
    setClickAddress(state, address) {
      state.clickAddress = address;
    },
    setLastRoute(state, route) {
      state.lastRoute = route;
    },
    setRoute(state, route) {
      state.route = route;
    },
    setCenterCoords(state, coords) {
      state.centerCoords = coords;
    },
    setMarkerCoords(state, coords) {
      state.markerCoords = coords;
    },
    setAirRouteCoords(state, coords) {
      state.airRouteCoords = coords;
    },
    setLastClick(state, click) {
      state.lastClick = click;
    },
    setAllClicks(state, allClicks) {
      state.allClicks = allClicks;
    },
  },
  actions: {
    async fetchRoute({ state, commit }) {
      commit('setIsRouteLoading', true);
      try {
        commit('setRoute', await getMinLengthRoute(state.markerCoords, state.mkadCoords));
      } catch (e) {
        console.log(e.message);
      } finally {
        commit('setIsRouteLoading', false);
      }
    },
  },
  namespaced: true,
});
