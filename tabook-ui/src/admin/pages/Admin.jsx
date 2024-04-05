import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { deepOrange, deepPurple } from '@mui/material/colors';
import ManageBook from '../components/ManageBook';
import ManageCategory from '../components/ManageCategory';
import ManageAuthor from '../components/ManageAuthor';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import Keycloak from 'keycloak-js';
import Logo from '../pages/Logo';
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Admin() {
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [open, setOpen] = React.useState(false);
    const openUserMenu = Boolean(anchorEl);
    const [loading, setLoading] = React.useState(true);

    const handleUserClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseUserMenu = (e) => {
        setAnchorEl(null);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                    console.info('Authenticated');
                    console.log('auth', auth);
                    console.log('Keycloak', keycloakInstance);
                    console.log('Access Token', keycloakInstance.token);

                    const userProfiles = keycloakInstance.tokenParsed;

                    setUserProfile(userProfiles.name);

                    axios.create({}).defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
                    localStorage.setItem('token', keycloakInstance.token);
                    setToken(keycloakInstance.token);

                    if (userProfiles && userProfiles.realm_access && userProfiles.realm_access.roles) {
                        // Kiểm tra vai trò ADMIN
                        const isAdmin = userProfiles.realm_access.roles.includes('ADMIN');
                        console.log(isAdmin);
                        if (isAdmin) {
                            keycloakInstance.redirectUri = window.location.origin + '/';
                        } else {
                            // Nếu không phải ADMIN, điều hướng tới trang 401
                            navigate('/401'); // Điều hướng tới trang 401
                        }
                    }

                    // keycloakInstance.redirectUri = window.location.origin + '/';
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
        <Box sx={{ width: '100%' }}>
            <Box
                className="bg-neutral-950"
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px',
                }}
            >
                <div className="logo-container">
                    <Logo className="logo" />
                </div>
                <div className="tabs-container">
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab
                            sx={{
                                color: 'white',
                                '&.Mui-selected': {
                                    color: '#fcd650',
                                    bgcolor: 'transparent',
                                },
                            }}
                            label="Quản lý sách"
                            {...a11yProps(0)}
                        />
                        <Tab
                            sx={{
                                color: 'white',
                                '&.Mui-selected': {
                                    color: '#fcd650',
                                    bgcolor: 'transparent',
                                },
                            }}
                            label="Quản lý thể loại"
                            {...a11yProps(1)}
                        />
                        <Tab
                            sx={{
                                color: 'white',
                                '&.Mui-selected': {
                                    color: '#fcd650',
                                    bgcolor: 'transparent',
                                },
                            }}
                            label="Quản lý tác giả"
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </div>
                <div>
                    <Avatar
                        onClick={handleUserClick}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        sx={{
                            bgcolor: '#fcd650',
                            color: 'black',
                        }}
                    >
                        {userProfile[0]}
                    </Avatar>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleCloseUserMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ManageBook />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ManageCategory />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <ManageAuthor />
            </CustomTabPanel>
        </Box>
    );
}
