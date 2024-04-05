import Footer from "../ui/Footer";

function UpdatePass() {
  return (
    <div className="register">
      <div className="heading">
        <div className="regis-head">
          <div className="regis-wrapper">
            <a href="/" className="logo">
              <img className="logo-image" alt="logo" src="/images/logo.png" />
            </a>
            <h3 className="regis-title">Cập nhật mật khẩu</h3>
          </div>

          <a href="/" className="regis-help">
            Bạn cần giúp đỡ?
          </a>
        </div>
      </div>

      <div className="regis-form">
        <form action="" method="POST" className="form" id="form-1">
          <h3 className="heading-form">Cập nhật mật khẩu</h3>

          <div className="regis-span">
            Mã để tạo lại mật khẩu sẽ được gửi vào email của bạn
          </div>

          <div className="spacer"></div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Nhập mã
            </label>
            <input
              type="text"
              className="search-form--input"
              placeholder="Nhập mã từ email..."
            />
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              className="search-form--input"
              placeholder="Nhập mật khẩu cũ"
            />
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Nhập mật khẩu mới
            </label>
            <input
              type="password"
              className="search-form--input"
              placeholder="Nhập mật khẩu mới"
            />
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              className="search-form--input"
              placeholder="Xác nhận mật khẩu mới"
            />
            <span className="form-message"></span>
          </div>

          <button className="form-submit">Hoàn thành</button>

          <div className="regis-span">
            Không nhận được mã?
            <a href="/gui-lai-ma" className="regis-span__login">
              Gửi lại mã
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default UpdatePass;
