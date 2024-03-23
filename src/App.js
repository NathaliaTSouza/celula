import "./App.css";
import People from "./components/People/People";

function App() {
  const url = "http://localhost:3000/people";

  return (
    <div className="App">
      <People url={url} /> 
    </div>
  );
}

export default App;
