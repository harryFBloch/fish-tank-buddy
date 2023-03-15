import { BiCarbResultsData, VolumeConversion } from "../store/MiscTypes";

export const calculateBicarbonateLevels = (
  input: number,
  units: 'ppm' | 'dKH' | 'mlPerLiter' | string
): BiCarbResultsData => {
  let ppm: number, dKH: number, mlPerLiter: number;

  switch (units) {
    case 'ppm':
      ppm = input;
      dKH = ppm / 17.848;
      mlPerLiter = ppm / 50;
      break;
    case 'dKH':
      dKH = input;
      ppm = dKH * 17.848;
      mlPerLiter = ppm / 50;
      break;
    case 'mlPerLiter':
      mlPerLiter = input;
      ppm = mlPerLiter * 50;
      dKH = ppm / 17.848;
      break;
    default:
      throw new Error('Invalid units specified.');
  }

  return { ppm: +(ppm).toFixed(2), dKH: +(dKH).toFixed(2), mlPerLiter: +(mlPerLiter).toFixed(2) };
}


export const convertVolumeUnits = (
  input: number,
  units: string
): VolumeConversion => {
  const conversions: Record<string, number> = {
    drops: 1,
    fluidOz: 29.5735,
    liter: 1000,
    ml: 1,
    cup: 236.588,
    pint: 473.176,
    quart: 946.353,
    tablespoon: 14.7868,
    teaspoon: 4.92892,
    usGallon: 3785.41,
    ukGallon: 4546.09,
  };

  const keys = Object.keys(conversions);

  if (!keys.includes(units)) {
    throw new Error('Invalid units specified.');
  }

  const result: VolumeConversion = {} as VolumeConversion;

  for (const key of keys) {
    const value = input * (conversions[units] / conversions[key]);
    result[key as keyof VolumeConversion] = +(value).toFixed(2);
  }

  return result;
}