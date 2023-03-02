import { ImageSourcePropType } from "react-native"

export type TankShapesType = {
  square: TankShapeType,
  rectangle: TankShapeType,
  hexagon: TankShapeType,
}

export type TankShapeType = {
  index: number,
  formula: string,
  name: string,
  image: ImageSourcePropType,
}

export const TankShapes: TankShapesType = {
  square: {index: 0, name: 'Cylindrical', formula: '', image: require('../assets/images/cylindar.png')},
  rectangle: {index: 1, name: 'Rectangle', formula: '', image: require('../assets/images/rectangle.png')},
  hexagon: {index: 2, name: 'Multi Side', formula: '', image: require('../assets/images/multiSide.png')},
}