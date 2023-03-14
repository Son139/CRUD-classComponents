import "./App.css";
import ListUser from "./components/ListUser";

function App() {
    return (
        <div
            className="App"
            style={{
                width: 1000,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                padding: "30px 30px 20px",
                boxShadow: "0 0 10px 4px #bfbfbf",
                borderRadius: 10,
            }}
        >
            <ListUser />
        </div>
    );
}

export default App;
