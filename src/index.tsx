import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import reportWebVitals from './reportWebVitals';
import { Paths } from './paths';
import './index.css';
import { Router } from 'express';
import { Register } from './pages/register';
import { Login } from './pages/login';
import { Auth } from './features/auth/auth';
import { Manga } from './pages/manga';
import { AddManga } from './pages/add-manga';
import { Status } from './pages/status';
import { CurrentManga } from './pages/current-manga';
import { EditManga } from './pages/edit-manga';
import { AddChapterManga } from './pages/add-chapter-manga';
import { CurrentChapterManga } from './pages/current-chapter-manga';


const router = createBrowserRouter([
  {
    path: Paths.home,
    element: <Manga />
  },
  {
    path: Paths.login,
    element: <Login />
  },
  {
    path: Paths.register,
    element: <Register />
  },
  {
    path: Paths.mangaAdd,
    element: <AddManga />
  },
  {
    path: `${Paths.status}/:status`,
    element: <Status />
  },
  {
    path: `${Paths.manga}/:name`,
    element: <CurrentManga />
  },
  {
    path: `${Paths.mangaEdit}/:name`,
    element: <EditManga />
  },
  {
    path: `${Paths.manga}/:name/add`,
    element: <AddChapterManga />
  },
  {
    path: `${Paths.manga}/:name/:name`,
    element: <CurrentChapterManga />
  },
]);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{
        algorithm: theme.darkAlgorithm
      }}>
        <Auth>
          <RouterProvider router={ router }/>
        </Auth>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
