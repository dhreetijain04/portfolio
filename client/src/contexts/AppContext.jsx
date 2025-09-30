import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Initial state
const initialState = {
  profile: null,
  projects: [],
  skills: [],
  experience: [],
  loading: false,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PROFILE: 'SET_PROFILE',
  SET_PROJECTS: 'SET_PROJECTS',
  SET_SKILLS: 'SET_SKILLS',
  SET_EXPERIENCE: 'SET_EXPERIENCE',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.SET_PROFILE:
      return { ...state, profile: action.payload, loading: false };
    case ActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload, loading: false };
    case ActionTypes.SET_SKILLS:
      return { ...state, skills: action.payload, loading: false };
    case ActionTypes.SET_EXPERIENCE:
      return { ...state, experience: action.payload, loading: false };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    // Set loading state
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    // Set error
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    // Clear error
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    // Fetch profile
    fetchProfile: async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.getProfile();
        dispatch({ type: ActionTypes.SET_PROFILE, payload: response.data });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch profile' });
      }
    },

    // Fetch projects
    fetchProjects: async (params = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.getProjects(params);
        dispatch({ type: ActionTypes.SET_PROJECTS, payload: response.data });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch projects' });
      }
    },

    // Fetch skills
    fetchSkills: async (category = '') => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.getSkills(category);
        dispatch({ type: ActionTypes.SET_SKILLS, payload: response.data });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch skills' });
      }
    },

    // Fetch experience
    fetchExperience: async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.getExperience();
        dispatch({ type: ActionTypes.SET_EXPERIENCE, payload: response.data });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to fetch experience' });
      }
    },

    // Send contact form
    sendContact: async (formData) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.sendContact(formData);
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message || 'Failed to send message' });
        throw error;
      }
    },
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load profile and projects by default
        await Promise.all([
          actions.fetchProfile(),
          actions.fetchProjects(),
          actions.fetchSkills(),
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { AppContext };
export { AppProvider as AppContextProvider };
export default AppContext;