import React from "react";
import AvatarModule from "boring-avatars";

const Avatar = AvatarModule.default || AvatarModule;

export default function BoringAvatar({ name }) {
   return React.createElement(Avatar, {
      size: 40,
      name,
      variant: "beam",
   })
}
