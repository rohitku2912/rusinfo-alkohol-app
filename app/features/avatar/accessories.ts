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
  {
    id: "hat-8",
    name: "Heksehatt",
    image: require("../../../assets/images/avatarAccessories/witch-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "ring-1",
    name: "Ring",
    image: require("../../../assets/images/avatarAccessories/ring.png"),
    position: "body",
    size: 82,
    offsetTop: 24,
  },
  {
    id: "scarf-1",
    name: "Skjerf",
    image: require("../../../assets/images/avatarAccessories/scarf.png"),
    position: "body",
    size: 120,
    offsetTop: 18,
  },
  {
    id: "tie-1",
    name: "Slips",
    image: require("../../../assets/images/avatarAccessories/tie.png"),
    position: "body",
    size: 105,
    offsetTop: 20,
  },
  {
    id: "hat-9",
    name: "Grønn hatt",
    image: require("../../../assets/images/avatarAccessories/green-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "hat-10",
    name: "Vikinghjelm",
    image: require("../../../assets/images/avatarAccessories/viking.png"),
    position: "head",
    size: 124,
    offsetTop: -8,
  },
  {
    id: "hat-11",
    name: "Safarihatt",
    image: require("../../../assets/images/avatarAccessories/safari-hat.png"),
    position: "head",
    size: 138,
    offsetTop: -5,
  },
  {
    id: "hat-12",
    name: "Trollmannshatt",
    image: require("../../../assets/images/avatarAccessories/wizard.png"),
    position: "head",
    size: 124,
    offsetTop: -8,
  },
  {
    id: "hat-13",
    name: "Politi hatt",
    image: require("../../../assets/images/avatarAccessories/police-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "glasses-2",
    name: "Festbriller",
    image: require("../../../assets/images/avatarAccessories/fun-glasses.png"),
    position: "face",
  },
  {
    id: "glasses-3",
    name: "Hjertebriller",
    image: require("../../../assets/images/avatarAccessories/heart-glasses.png"),
    position: "face",
  },
  {
    id: "hat-14",
    name: "Bowlerhatt",
    image: require("../../../assets/images/avatarAccessories/bowler-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "hat-15",
    name: "Lilla hatt",
    image: require("../../../assets/images/avatarAccessories/purple-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
  {
    id: "hat-16",
    name: "Irsk hatt",
    image: require("../../../assets/images/avatarAccessories/irish-hat.png"),
    position: "head",
    size: 118,
    offsetTop: -5,
  },
];
