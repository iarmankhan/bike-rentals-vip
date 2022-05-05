import MainNavigation from "src/navigation";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "src/config/firebase";

const App = () => {
  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);
  return <MainNavigation />;
};

export default App;
