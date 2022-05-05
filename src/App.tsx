import MainNavigation from "src/navigation";
import { useEffect } from "react";
import { app } from "src/config/firebase";

const App = () => {
  useEffect(() => {
    console.log({ app });
  }, []);
  return <MainNavigation />;
};

export default App;
