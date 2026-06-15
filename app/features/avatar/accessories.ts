import { ImageSourcePropType } from "react-native";

type AccessoryPosition = "head" | "face" | "body";

export type Accessory = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  position: AccessoryPosition;
  size?: number;
  offsetTop?: number;
  offsetLeft?: number;
};

export const lockedAccessoryImage = require("../../../assets/images/avatarAccessories/lock.png");

export const accessories: Accessory[] = [
  {
    id: "hat-1",
    name: "Tiara",
    image: require("../../../assets/images/avatarAccessories/tiara.png"),
    position: "head",
  },
  {
    id: "hat-2",
    name: "Beret",
    image: require("../../../assets/images/avatarAccessories/beret.png"),
    position: "head",
  },
  {
    id: "hat-3",
    name: "Bandana",
    image: require("../../../assets/images/avatarAccessories/headband.png"),
    position: "head",
  },
  {
    id: "hat-4",
    name: "Caps",
    image: require("../../../assets/images/avatarAccessories/cap.png"),
    position: "head",
  },
  {
    id: "hat-5",
    name: "Hatt",
    image: require("../../../assets/images/avatarAccessories/hat.png"),
    position: "head",
    size: 220,
  },
  {
    id: "hat-6",
    name: "Krone",
    image: require("../../../assets/images/avatarAccessories/crown.png"),
    position: "head",
  },
  {
    id: "necklace-1",
    name: "Smykke",
    image: require("../../../assets/images/avatarAccessories/necklace.png"),
    position: "body",
    size: 116,
    offsetTop: 25,
  },
  {
    id: "hat-7",
    name: "Pirathatt",
    image: require("../../../assets/images/avatarAccessories/pirates.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "necklace-3",
    name: "Medaljong",
    image: require("../../../assets/images/avatarAccessories/pendant.png"),
    position: "body",
    size: 112,
    offsetTop: 10,
  },
  {
    id: "badge-1",
    name: "Diplom",
    image: require("../../../assets/images/avatarAccessories/badge.png"),
    position: "body",
    offsetLeft: 30,
  },
  {
    id: "necklace-5",
    name: "Sløyfe",
    image: require("../../../assets/images/avatarAccessories/bow-tie.png"),
    position: "body",
  },
  {
    id: "glasses-1",
    name: "Solbriller",
    image: require("../../../assets/images/avatarAccessories/sunglasses.png"),
    position: "face",
  },
];
