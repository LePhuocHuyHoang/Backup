import "../style/ChangePassword.scss";
import Button from "../ui/Button";
function ChangePassword() {
  return (
    <div className="change-password">
      <h1>Đổi mật khẩu</h1>
      <form action="/change-password" method="POST" className="form">
        <div className="form__item">
          <label htmlFor="current-password">Nhập mật khẩu hiện tại:</label>
          <input
            type="password"
            id="current-password"
            name="current-password"
            required
          />
        </div>
        <div className="form__item">
          <label htmlFor="new-password">Nhập mật khẩu mới:</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            required
          />
        </div>
        <div className="form__item">
          <label htmlFor="confirm-password">Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>

        <Button type="submit">Đổi mật khẩu</Button>
      </form>
    </div>
  );
}

export default ChangePassword;
