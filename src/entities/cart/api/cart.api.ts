import { authApi } from '@/_shared';
import { CartMapper } from '@/entities/cart/lib/CartMapper';
import { CartItemPostRequest, CartItemResponse, CartSummary, CartWithSummary } from '@/entities/cart/model/Cart';

export const fetchCart = async (): Promise<CartWithSummary> => {
  const {
    data: { cartList, cartList_summary }
  } = await authApi.get<{
    cartList: CartItemResponse[];
    cartList_summary: CartSummary;
  }>('/carts/carts');
  return { items: CartMapper.toEntities(cartList), summary: cartList_summary };
};

export const addCart = async (data: CartItemPostRequest[]) => {
  return await authApi.post('/carts/carts', {
    cartOptions: data
  });
};

export const removeCart = async (cartIds: string[]) => {
  const validIds = cartIds.map((id) => Number(id)).filter((id) => !isNaN(id) && id > 0);

  if (validIds.length === 0) {
    throw new Error('Invalid cart IDs');
  }

  return await authApi.delete(`/carts/carts`, {
    data: {
      del_idxs: validIds
    }
  });
};

export const updateCart = async (cartId: string, amount: number) => {
  const validId = Number(cartId);
  if (isNaN(validId) || validId <= 0) {
    throw new Error('Invalid cart ID');
  }

  return await authApi.patch(`/carts/carts`, {
    update_idx: validId,
    updateAmount: amount
  });
};

export const fetchCartCount = async (): Promise<number> => {
  const { data } = await authApi.get('/carts/count');
  return Number(data.total_count);
};
