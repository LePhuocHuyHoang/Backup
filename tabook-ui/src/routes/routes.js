import Admin from '../admin/pages/Admin';

import Page401 from '../admin/pages/Page401';

const publicRoutes = [
    {
        path: '/',
        component: Admin,
    },
    {
        path: '/401',
        component: Page401,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
