import React, {useEffect, useState} from 'react';
import {client} from '../lib/client';
import {Product, FooterBanner, HeroBanner} from '../components';
import Spinner from '../components/Spinner.jsx';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [bannerData, setBannerData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getItems = async () => {
            try {
                const query = '*[_type == "product"]';
                const items = await client.fetch(query);

                const bannerQuery = '*[_type == "banner"]';
                const data = await client.fetch(bannerQuery);

                setProducts(items);
                setBannerData(data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
        };

        getItems();
    }, []);

    if (loading) return <Spinner message={'Fetching products'} />;

    return (
        <div>
            {error ? (
                <div style={{color: 'red', fontSize: '18px'}}></div>
            ) : !products.length || !bannerData.length ? (
                <div style={{fontSize: '18px'}}>No products</div>
            ) : (
                <div>
                    <HeroBanner heroBanner={bannerData[0]} />
                    <div className='products-heading'>
                        <h2>Best Seller Products</h2>
                        <p>speaker There are many variations passages</p>
                    </div>

                    <div className='products-container'>
                        {products?.map((product) => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>

                    <FooterBanner footerBanner={bannerData[0]} />
                </div>
            )}
        </div>
    );
};

export default Home;
