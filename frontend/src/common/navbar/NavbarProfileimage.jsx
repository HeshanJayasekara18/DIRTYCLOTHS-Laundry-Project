// Example: NavbarProfileImage.jsx
import React from "react";

import { UserModel } from "../../reg/UserModel";
import { FaUserCircle } from "react-icons/fa"; // User icon

const NavbarProfileImage = () => {
  const user = UserModel.getSession();

  let profileImgSrc = null;

  if (user?.profileImage) {
    if (typeof user.profileImage === "string" && user.profileImage.length > 0) {
      profileImgSrc = user.profileImage;
    } else if (typeof user.profileImage === "object" && user.profileImage.data) {
      const base64String = btoa(
        new Uint8Array(user.profileImage.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      profileImgSrc = `data:image/jpeg;base64,${base64String}`;
    }
  }

  return profileImgSrc ? (
    <img
      src={profileImgSrc}
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <FaUserCircle className="w-10 h-10 text-gray-400" />
  );
};

export default NavbarProfileImage;