import { ToastContainer, toast } from 'react-toastify';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Home from './Pages/Home';

import { useState } from 'react';

function App() {
  const [id, setid] = useState("");
  return (
    <BrowserRouter>
    <div className="App">
      <ToastContainer position='top-center'/>
      <Routes>
        <Route  path='/' element={<Home id={id} setid={setid}/>}/>

      </Routes>
      
    </div>
    </BrowserRouter>
  );
}

export default App;
