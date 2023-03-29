import { ImageSourcePropType } from "react-native"

export type TankShapesType = {
  rectangle: TankShapeType,
  cylindrical: TankShapeType,
  multiSide: TankShapeType,
}

export type TankShapeType = {
  index: number,
  formula: string,
  name: string,
  image: ImageSourcePropType,
}

export type Results = {
  volume: number,
  waterVolume: number,
  surfaceArea: number,
  substrateAmount: number,
  fishSizes: FishSizes,
  area: number,
}

export type FishSizes = {
  smallfish: {min: number, max: number},
  mediumfish: {min: number, max: number},
  largefish: {min: number, max: number},
}

export const ResultsTemplate: Results = {
  volume: 0,
  surfaceArea: 0,
  substrateAmount: 0,
  waterVolume: 0,
  area: 0,
  fishSizes: {
    smallfish: {min: 0, max: 0},
    mediumfish: {min: 0, max: 0},
    largefish: {min: 0, max: 0},
  }
}

export const TankShapes: TankShapesType = {
  rectangle: {index: 1, name: 'Rectangle', formula: '', image: require('../assets/images/rectangle.png')},
  cylindrical: {index: 0, name: 'Cylindrical', formula: '', image: require('../assets/images/cylindar.png')},
  multiSide: {index: 2, name: 'Multi Side', formula: '', image: require('../assets/images/multiSide.png')},
}

export type BiCarbResultsData = {
  dKH: number,
  ppm: number,
  mlPerLiter: number,
}

export interface VolumeConversion {
  drops: number;
  fluidOz: number;
  liter: number;
  ml: number;
  cup: number;
  pint: number;
  quart: number;
  tablespoon: number;
  teaspoon: number;
  usGallon: number;
  ukGallon: number;
}