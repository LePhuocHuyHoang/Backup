import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
// ----------------------------------------------------------------------

export default function Page401() {
    const navigate = useNavigate();
    const location = useLocation();
    const [kc, setKc] = React.useState(null);
    const [token, setToken] = React.useState('');
    const [userProfile, setUserProfile] = React.useState({});

    React.useEffect(() => {
        const initOptions = {
            url: 'http://localhost:8080',
            realm: 'beebook',
            clientId: 'beebook-admin',
        };

        const keycloakInstance = new Keycloak(initOptions);

        keycloakInstance
            .init({
                onLoad: 'login-required',
                checkLoginIframe: true,
                pkceMethod: 'S256',
            })
            .then((auth) => {
                if (!auth) {
                    console.log('Authenticated: false');
                } else {
                    axios.create({}).defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
                    localStorage.setItem('token', keycloakInstance.token);
                    setToken(keycloakInstance.token);
                    keycloakInstance.onTokenExpired = () => {
                        console.log('token expired');
                    };
                }
                setKc(keycloakInstance);
            });
    }, []); // Empty dependency array ensures that this effect runs only once, like componentDidMount

    const handleLogin = () => {
        kc.login();
    };
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        kc.logout();
    };
    return (
        <>
            <Container>
                <Box
                    sx={{
                        py: 12,
                        maxWidth: 480,
                        mx: 'auto',
                        display: 'flex',
                        minHeight: '100vh',
                        textAlign: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h3" sx={{ mb: 3 }}>
                        Xin lỗi, bạn không có quyền truy cập vào trang này!
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        Bạn đang cố tình truy cập vào trang Admin khi chưa được cấp quyền hoặc cho phép. Vui lòng liên
                        hệ administration@gmail.com
                    </Typography>

                    <Button href="/" size="large" variant="contained" onClick={handleLogout}>
                        Trở lại
                    </Button>
                </Box>
            </Container>
        </>
    );
}
