import { Link } from "react-router-dom";
import "../style/EditProfile.scss";
import Button from "../ui/Button";
function editProfile() {
  return (
    <div className="edit-profile">
      <h1 className="title">Thay đổi thông tin tài khoản</h1>
      <img
        src="user-profile.png"
        alt="Profile Image"
        className="profile-image"
      />
      <form action="/update-information" method="POST" className="form">
        <div className="form__item">
          <div className="item">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="item">
            <label htmlFor="gender">Giới tính:</label>
            <select id="gender" name="gender" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form__item">
          <div className="item">
            <label htmlFor="firstName">Tên:</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="item">
            <label htmlFor="lastName">Họ:</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
        </div>
        <div className="form__item">
          <div className="item">
            <label htmlFor="birthday">Ngày sinh:</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              placeholder="dd-mm-yyyy"
              required
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
        </div>

        <div className="button-ctn">
          <Button type="submit">Cập nhật</Button>
          <Link to="/changepassword">
            <Button type="button">Đổi mật khẩu</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default editProfile;
