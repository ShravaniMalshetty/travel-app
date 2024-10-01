import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'sonner'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element:<CreateTrip/>
  },
  {
    path:'/component/Header',
    element:<Header/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster/>
    <Header/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
