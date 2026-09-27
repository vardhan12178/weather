// Values arrive in the user's chosen unit system ('metric' = °C + m/s,
// 'imperial' = °F + mph). Threshold logic (alerts, advice, colours) is written
// in metric, so normalise before comparing.

export const toCelsius = (temp, unit) => (unit === 'imperial' ? ((temp - 32) * 5) / 9 : temp);

export const fromCelsius = (tempC, unit) => (unit === 'imperial' ? (tempC * 9) / 5 + 32 : tempC);

export const convertTemp = (temp, fromUnit, toUnit) =>
  fromUnit === toUnit ? temp : fromCelsius(toCelsius(temp, fromUnit), toUnit);

export const toMetersPerSecond = (speed, unit) => (unit === 'imperial' ? speed * 0.44704 : speed);

export const windUnitLabel = (unit) => (unit === 'imperial' ? 'mph' : 'm/s');

export const tempUnitLabel = (unit) => (unit === 'imperial' ? 'F' : 'C');
