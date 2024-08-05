const DEFAULT_STATE = {
  count: 0,
};

export const countReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    case 'SET_COUNT':
      return {
        ...state,
        count: action.payload,
      };
    default:
      return state;
  }
};
