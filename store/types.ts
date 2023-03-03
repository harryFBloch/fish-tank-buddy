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
  surfaceArea: number,

}

export const ResultsTemplate: Results = {
  volume: 0,
  surfaceArea: 0,
}

export const TankShapes: TankShapesType = {
  rectangle: {index: 1, name: 'Rectangle', formula: '', image: require('../assets/images/rectangle.png')},
  cylindrical: {index: 0, name: 'Cylindrical', formula: '', image: require('../assets/images/cylindar.png')},
  multiSide: {index: 2, name: 'Multi Side', formula: '', image: require('../assets/images/multiSide.png')},
}