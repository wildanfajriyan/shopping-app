const DEFAULT_STATE = {
  items: [],
};

export const cartReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'CART_GET':
      return {
        ...state,
        items: action.payload,
      };
  }
  return state;
};
