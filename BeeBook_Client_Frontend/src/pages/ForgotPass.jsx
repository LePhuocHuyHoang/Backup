
function ForgotPass() {
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
                        Nhập email để tiến hành lấy lại mật khẩu
                    </div>

                    <div className="spacer"></div>
                    
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input type="email" className="search-form--input" placeholder="voquoctuan@example.com" />
                        <span className="form-message"></span>
                    </div>

                    <button className="form-submit">
                        Gửi
                    </button> 
                </form>
            </div>

           
        </div>
    );
}

export default ForgotPass;