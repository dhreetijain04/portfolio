import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Static profile data for production/fallback
const staticProfile = {
  firstName: 'Dhreeti',
  lastName: 'Jain',
  title: 'Full Stack Developer & AI Enthusiast',
  bio: 'ECE student at MAIT building innovative AI-powered solutions and next-generation web applications with expertise in full-stack development.',
    email: 'dhreetijain04@gmail.com',
    location: 'New Delhi, India'
};

// Static projects data for production/fallback
const staticProjects = [
  {
    id: 1,
    title: 'AgroAI - AI-Powered Farming Assistant',
    description: 'AI-Powered Farming Assistant with Google Gemini AI + YOLOv8 pest detection for crop disease identification and smart farming solutions',
    technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Google Gemini AI', 'YOLOv8', 'Python'],
    githubUrl: 'https://github.com/dhreetijain04/AgroAI',
    liveUrl: 'https://agro-ai-app.netlify.app',
    featured: true
  },
  {
    id: 2,
    title: 'AI Code Review Assistant',
    description: 'GitHub-integrated platform for automated development code review optimization with AI-powered suggestions and quality analysis',
    technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'GitHub API', 'OpenAI API'],
    githubUrl: 'https://github.com/dhreetijain04/ai-code-review-assistant',
    liveUrl: 'https://ai-code-review-assistant.netlify.app',
    featured: true
  }
];

// Initial state
const initialState = {
  profile: null,
  projects: staticProjects, // Start with static projects
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
        console.warn('Profile API not available, using static profile data:', error.message);
        // Fallback to static profile when API is not available (e.g., on Netlify)
        dispatch({ type: ActionTypes.SET_PROFILE, payload: staticProfile });
      }
    },

    // Fetch projects
    fetchProjects: async (params = {}) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const response = await apiService.getProjects(params);
        dispatch({ type: ActionTypes.SET_PROJECTS, payload: response.data });
      } catch (error) {
        console.warn('API not available, using static projects data:', error.message);
        // Fallback to static projects when API is not available (e.g., on Netlify)
        dispatch({ type: ActionTypes.SET_PROJECTS, payload: staticProjects });
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
        // Try to load from API, but gracefully fallback to static data if unavailable
        await actions.fetchProjects();
        await actions.fetchProfile();
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