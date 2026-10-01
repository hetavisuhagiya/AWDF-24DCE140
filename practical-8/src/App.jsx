import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Home from "./pages/Home";
import {
    lazy,
    Suspense
} from "react";

const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {

    return (
        <BrowserRouter>

            <nav className="navbar">

                <h2>Practical 8</h2>

                <div>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/projects">
                        Projects
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>

                </div>

            </nav>


            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;