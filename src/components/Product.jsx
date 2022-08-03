import React from 'react';
import {Link} from 'react-router-dom';

import {urlFor} from '../lib/client';

const Product = ({product}) => {
    return (
        <div>
            <Link to={`/product/${product?.slug?.current}`}>
                <div className='product-card'>
                    {product?.image && (
                        <img
                            src={urlFor(product?.image && product?.image[0])}
                            width={250}
                            height={250}
                            className='product-image'
                            alt=''
                        />
                    )}
                    <p className='product-name'>{product?.name}</p>
                    <p className='product-price'>${product?.price}</p>
                </div>
            </Link>
        </div>
    );
};

export default Product;
