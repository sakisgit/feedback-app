import { createContext, useState, useEffect } from "react";
import FeedbackData from "../../data/FeedbackData";

const FeedbackContext = createContext();
const STORAGE_KEY = "feedback-app-items";

const loadFeedbackFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : FeedbackData;
  } catch (error) {
    return FeedbackData;
  }
};

export const FeedbackProvider = ({children}) =>  {
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);

    const [feedbackEdit, setFeedbackEdit] = useState({
      item: {},
      edit: false
    });

    useEffect(() => {
      const data = loadFeedbackFromStorage();
      setFeedback(data);
      setIsLoading(false);
    }, []);

    useEffect(() => {
      if (!isLoading) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
      }
    }, [feedback, isLoading]);

    // Add feedback
    const addFeedback = (newFeedback) => {
      const itemWithId = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now(),
        ...newFeedback,
      };
      setFeedback([itemWithId, ...feedback]);
    };

    // Delete feedback
    const deleteFeedback = (id) => {
      if(window.confirm('Are you sure...')){
          setFeedback(feedback.filter((item) => {
            return item.id !== id;
          }));
      };
    };

  // Update feedback item 
  const updateFeedback = (id, upditem) => {
    setFeedback(feedback.map((item) => item.id === id ? { ...item, ...upditem } : item)); 
  };

  // Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit:true,
    });
  };

    return <FeedbackContext.Provider value={{feedback, feedbackEdit,isLoading, deleteFeedback, addFeedback, editFeedback, updateFeedback }}>
            {children}
        </FeedbackContext.Provider>
};

export default FeedbackContext;