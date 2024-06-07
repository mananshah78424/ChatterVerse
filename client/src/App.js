import "bootstrap/dist/css/bootstrap.min.css";
import ApolloProvider from "./ApolloProvider";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/messages";
import "./App.css";

import DynamicRoute from "./util/DynamicRoutes";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Routes>
                <Route
                  path="/"
                  element={<DynamicRoute component={Home} authenticated />}
                />
                <Route
                  path="/register"
                  element={<DynamicRoute component={Register} guest />}
                />
                <Route
                  path="/login"
                  element={<DynamicRoute component={Login} guest />}
                />
              </Routes>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
