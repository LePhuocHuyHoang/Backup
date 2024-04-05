import * as HoverCard from "@radix-ui/react-hover-card";
import { useEffect, useState } from "react";
import "../style/HoverUser.scss";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const HoverUser = ({ userProfile, handleLogout }) => {
  const navigate = useNavigate();
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <div className="user-info">
          <p>{userProfile.userName}</p>
          <img src="/user-profile.png" alt="user icon" />
        </div>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content className="HoverCardContent">
          <ul className="user-menu">
            <h2>
              {userProfile.firstName} {userProfile.lastName}
            </h2>
            <h2>Điểm của tôi</h2>
            <li>
              <div>
                <div className="num-point">
                  <p>{userProfile.point}</p>
                  <img src="/dollar.png" alt="" />
                </div>
                <p className="add-point" onClick={() => navigate("/buypoint")}>
                  Nạp point
                </p>
              </div>
            </li>
            <li>
              <img src="/liked-icon.png" alt="" />
              <p onClick={() => navigate("/favoriteBook")}>
                Danh sách yêu thích
              </p>
            </li>
            <li onClick={() => navigate("/history")}>
              <img src="/checklist.png" alt="" />
              <p>Đã mua</p>
            </li>
            <li onClick={handleLogout}>
              <img src="/logout.png" alt="" />
              <p>Đăng xuất</p>
            </li>
          </ul>
          {/* <HoverCard.Arrow className="HoverCardArrow" /> */}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default HoverUser;
