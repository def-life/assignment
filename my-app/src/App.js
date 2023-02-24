import AddProduct from "./AddProduct.js";
import Header from "./Header.js";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Products from "./Products.js";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => {
            return <AddProduct {...props} />;
          }}
        />
        <Route
          exact
          path="/products"
          render={(props) => <Products {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
