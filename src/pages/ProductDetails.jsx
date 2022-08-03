import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    AiOutlineMinus,
    AiOutlinePlus,
    AiFillStar,
    AiOutlineStar,
} from 'react-icons/ai';

import {client, urlFor} from '../lib/client';
import {Product} from '../components';
import {useStateContext} from '../context/StateContext.js';
import Spinner from '../components/Spinner.jsx';

const ProductDetails = () => {
    const [index, setIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const {decQty, incQty, qty, onAdd, setShowCart} = useStateContext();
    const {slug} = useParams();

    const handleBuyNow = () => {
        onAdd(product, qty);

        setShowCart(true);
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
                const productsQuery = '*[_type == "product"]';

                const item = await client.fetch(query);
                const items = await client.fetch(productsQuery);
                setProduct(item);
                setProducts(items);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                setError(err.message);
            }
        };
        getProduct();
    }, [slug]);

    if (loading) return <Spinner message={'Fetching product'} />;

    return (
        <div>
            {error ? (
                <div style={{color: 'red', fontSize: '18px'}}></div>
            ) : !products.length || !product?.name ? (
                <div style={{fontSize: '18px'}}>No product with given path</div>
            ) : (
                <div>
                    <div className='product-detail-container'>
                        <div>
                            <div className='image-container'>
                                {product.image && (
                                    <img
                                        src={urlFor(
                                            product?.image &&
                                                product?.image[index],
                                        )}
                                        className='product-detail-image'
                                        alt=''
                                    />
                                )}
                            </div>
                            <div className='small-images-container'>
                                {product.image?.map((item, i) => (
                                    <img
                                        key={i}
                                        src={urlFor(item)}
                                        className={
                                            i === index
                                                ? 'small-image selected-image'
                                                : 'small-image'
                                        }
                                        onMouseEnter={() => setIndex(i)}
                                        alt=''
                                    />
                                ))}
                            </div>
                        </div>

                        <div className='product-detail-desc'>
                            <h1>{product.name}</h1>
                            <div className='reviews'>
                                <div>
                                    <AiFillStar />
                                    <AiFillStar />
                                    <AiFillStar />
                                    <AiFillStar />
                                    <AiOutlineStar />
                                </div>
                                <p>(20)</p>
                            </div>
                            <h4>Details: </h4>
                            <p>{product.details}</p>
                            <p className='price'>${product.price}</p>
                            <div className='quantity'>
                                <h3>Quantity:</h3>
                                <p className='quantity-desc'>
                                    <span className='minus' onClick={decQty}>
                                        <AiOutlineMinus />
                                    </span>
                                    <span className='num'>{qty}</span>
                                    <span className='plus' onClick={incQty}>
                                        <AiOutlinePlus />
                                    </span>
                                </p>
                            </div>
                            <div className='buttons'>
                                <button
                                    type='button'
                                    className='add-to-cart'
                                    onClick={() => onAdd(product, qty)}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    type='button'
                                    className='buy-now'
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='maylike-products-wrapper'>
                        <h2>You may also like</h2>
                        <div className='marquee'>
                            <div className='maylike-products-container track'>
                                {products.map((item) => (
                                    <Product key={item._id} product={item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProductDetails;
