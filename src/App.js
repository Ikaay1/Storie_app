import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {Footer, Navbar} from './components';
import ProductDetails from './pages/ProductDetails.jsx';
import Home from './pages/Home.jsx';
import {StateContext} from './context/StateContext';
import './App.scss';
const App = () => {
    return (
        <div>
            <StateContext>
                <div className='layout'>
                    <header>
                        <Navbar />
                    </header>
                    <Toaster />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route
                            path='/product/:slug'
                            element={<ProductDetails />}
                        />
                    </Routes>
                    <footer>
                        <Footer />
                    </footer>
                </div>
            </StateContext>
        </div>
    );
};

export default App;
