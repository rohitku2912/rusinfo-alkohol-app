import { ImageSourcePropType } from "react-native";

export type AvatarAnchor = {
  top: number;
  left: number;
  scale?: number;
};

export type Avatar = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  anchors: {
    head: AvatarAnchor;

    face: AvatarAnchor;

    body?: AvatarAnchor;
  };
};

const defaultAnchors = {
  head: { top: 18, left: 110, scale: 0.85 },
  face: { top: 88, left: 110, scale: 1 },
  body: { top: 190, left: 112, scale: 0.75 },
};

export const avatars: Avatar[] = [
  {
    id: "avatar-1",
    name: "Katt",
    image: require("../../../assets/images/avatars/001-cat.png"),
    anchors: defaultAnchors,
  },
  {
    id: "avatar-2",
    name: "Sebra",
    image: require("../../../assets/images/avatars/020-zebra.png"),
    anchors: {
      head: { top: 20, left: 110, scale: 0.75 },
      face: { top: 100, left: 110, scale: 0.9 },
      body: { top: 210, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-3",
    name: "Ape",
    image: require("../../../assets/images/avatars/003-monkey.png"),
    anchors: defaultAnchors,
  },
  {
    id: "avatar-4",
    name: "Kanin",
    image: require("../../../assets/images/avatars/004-rabbit.png"),
    anchors: {
      head: { top: 60, left: 110, scale: 0.85 },
      face: { top: 110, left: 110, scale: 1 },
      body: { top: 190, left: 112, scale: 0.75 },
    },
  },
  {
    id: "avatar-5",
    name: "Vaskebjørn",
    image: require("../../../assets/images/avatars/005-raccoon.png"),
    anchors: {
      head: { top: 30, left: 110, scale: 0.85 },
      face: { top: 110, left: 110, scale: 1 },
      body: { top: 190, left: 112, scale: 0.75 },
    },
  },
  {
    id: "avatar-6",
    name: "Pingvin",
    image: require("../../../assets/images/avatars/006-penguin.png"),
    anchors: {
      head: { top: 20, left: 110, scale: 0.85 },
      face: { top: 85, left: 110, scale: 0.95 },
      body: { top: 162, left: 110, scale: 0.8 },
    },
  },
  {
    id: "avatar-7",
    name: "Panda",
    image: require("../../../assets/images/avatars/007-panda bear.png"),
    anchors: defaultAnchors,
  },
  {
    id: "avatar-8",
    name: "Gepard",
    image: require("../../../assets/images/avatars/008-cheetah.png"),
    anchors: defaultAnchors,
  },
  {
    id: "avatar-9",
    name: "Lemur",
    image: require("../../../assets/images/avatars/022-lemur.png"),
    anchors: {
      head: { top: 24, left: 110, scale: 0.75 },
      face: { top: 110, left: 112, scale: 0.85 },
      body: { top: 195, left: 113, scale: 0.75 },
    },
  },
  {
    id: "avatar-10",
    name: "Ku",
    image: require("../../../assets/images/avatars/010-cow.png"),
    anchors: {
      head: { top: 24, left: 110, scale: 0.75 },
      face: { top: 110, left: 110, scale: 1 },
      body: { top: 205, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-11",
    name: "Hjort",
    image: require("../../../assets/images/avatars/011-deer.png"),
    anchors: {
      head: { top: 60, left: 110, scale: 0.75 },
      face: { top: 120, left: 110, scale: 0.9 },
      body: { top: 215, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-12",
    name: "Hund",
    image: require("../../../assets/images/avatars/012-dog.png"),
    anchors: {
  head: { top: 18, left: 110, scale: 0.85 },
  face: { top: 100, left: 110, scale: 1 },
  body: { top: 190, left: 110, scale: 0.75 },
},
  },
  {
    id: "avatar-13",
    name: "Gris",
    image: require("../../../assets/images/avatars/013-pig.png"),
    anchors: defaultAnchors,
  },
  {
    id: "avatar-14",
    name: "Ulv",
    image: require("../../../assets/images/avatars/014-wolf.png"),
    anchors: {
      head: { top: 25, left: 110, scale: 0.75 },
      face: { top: 110, left: 110, scale: 0.9 },
      body: { top: 215, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-15",
    name: "Rev",
    image: require("../../../assets/images/avatars/015-fox.png"),
    anchors: {
  head: { top: 40, left: 110, scale: 0.85 },
  face: { top: 110, left: 110, scale: 1 },
  body: { top: 190, left: 112, scale: 0.75 },
},
  },
  {
    id: "avatar-16",
    name: "Løve",
    image: require("../../../assets/images/avatars/016-lion.png"),
    anchors: {
      head: { top: 18, left: 110, scale: 0.75 },
      face: { top: 110, left: 110, scale: 0.9 },
      body: { top: 210, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-17",
    name: "Hest",
    image: require("../../../assets/images/avatars/017-horse.png"),
    anchors: {
      head: { top: 20, left: 110, scale: 0.75 },
      face: { top: 100, left: 110, scale: 0.9 },
      body: { top: 210, left: 110, scale: 0.75 },
    },
  },
  {
    id: "avatar-18",
    name: "Villsvin",
    image: require("../../../assets/images/avatars/018-wild boar.png"),
    anchors: {
      head: { top: 25, left: 110, scale: 0.75 },
      face: { top: 100, left: 110, scale: 0.9 },
      body: { top: 205, left: 110, scale: 0.75 },
    },
  },
];
