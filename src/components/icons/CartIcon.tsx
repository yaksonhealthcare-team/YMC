import { fetchCartCount } from '@/apis/cart.api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartIcon = () => {
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartCount().then((data) => setCount(data));
  }, []);

  const moveToCartPage = () => {
    navigate('/cart');
  };

  return (
    <button className="relative inline-block  rounded" onClick={moveToCartPage} aria-label="장바구니">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.40002 6.5H15.6C19 6.5 19.34 8.09 19.57 10.03L20.47 17.53C20.76 19.99 20 22 16.5 22H7.51003C4.00003 22 3.24002 19.99 3.54002 17.53L4.44003 10.03C4.66003 8.09 5.00002 6.5 8.40002 6.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.41 17.0303H8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary text-white text-[10px] font-sb rounded-full">
          {count > 99 ? '99+' : count}
        </div>
      )}
    </button>
  );
};

export default CartIcon;
