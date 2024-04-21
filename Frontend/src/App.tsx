import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from './components/User';
import { Admin } from './components/Admin';

function App() {

  return (
    <div className='bg-slate-300 min-h-screen flex items-center justify-center'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<User />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
