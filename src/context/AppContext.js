import React, { createContext, useContext, useReducer } from "react";

export const AppContext = createContext();

const initialState = {
  users: [],
  todos: {},
  currentUser: null,
};

// 액션 타입 정의
export const ActionTypes = {
  SET_CURRENT_USER: "SET_CURRENT_USER",
  UPDATE_TODOS: "UPDATE_TODOS",
  UPDATE_USERS: "UPDATE_USERS",
  LOGOUT: "LOGOUT",
};

// 리듀서 함수
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case ActionTypes.UPDATE_TODOS:
      if (Array.isArray(action.payload)) {
        // 단일 사용자의 todos 업데이트
        return {
          ...state,
          todos: {
            ...state.todos,
            [state.currentUser]: action.payload,
          },
        };
      } else {
        // 전체 todos 객체 업데이트
        return {
          ...state,
          todos: action.payload,
        };
      }
    case ActionTypes.UPDATE_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
};

// 커스텀 훅
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// 초기 상태를 localStorage에서 로드하는 함수
const loadInitialState = () => {
  try {
    const savedData = JSON.parse(localStorage.getItem("appData"));
    return savedData || initialState;
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return initialState;
  }
};

// Provider 컴포넌트
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, loadInitialState());

  // 상태가 변경될 때마다 localStorage 업데이트
  React.useEffect(() => {
    try {
      localStorage.setItem("appData", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
