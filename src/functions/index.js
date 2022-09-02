// функия находит n точек из массива toCoords,
// котыре образуют с точкой fromPoint прямую наименьшей длины
export function getNearCoords(fromPoint, toCoords, n) {
  const sortedByLengthCoords = [...toCoords[0]].sort((a, b) => {
    const lengthA = window.ymaps.coordSystem.geo.getDistance(fromPoint, a);
    const lengthB = window.ymaps.coordSystem.geo.getDistance(fromPoint, b);
    return lengthA - lengthB;
  });

  return sortedByLengthCoords.slice(0, n);
}

export async function getMinLengthRoute(fromPoint, toCoords) {
  const nearCoords = getNearCoords(fromPoint, toCoords, 15);

  let minRoute = await window.ymaps.route([fromPoint, nearCoords[0]]);
  let minLength = minRoute.getLength();

  const promises = nearCoords.map((el) => window.ymaps.route([fromPoint, el]));
  const routes = await Promise.all(promises);

  routes.forEach((route) => {
    const routeLength = route.getLength();
    if (routeLength < minLength) {
      minLength = routeLength;
      minRoute = route;
    }
  });
  return minRoute;
}
