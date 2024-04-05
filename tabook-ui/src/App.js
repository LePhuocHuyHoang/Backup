import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { privateRoutes, publicRoutes } from './routes/routes';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Pages = route.component;
                        return <Route key={index} path={route.path} element={<Pages />} />;
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
