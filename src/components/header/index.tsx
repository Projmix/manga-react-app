import { Layout, Space, Typography } from 'antd';
import { LoginOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { Paths } from '../../paths';
import { CustomButton } from '../custom-button';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../features/auth/authSlice';

export const Header = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogoutClick = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('manga-settings-page');
    localStorage.removeItem('manga-settings-translate');    
    navigate('/login');
  }

  return (
    <Layout.Header className={styles.header}>
      <Space>
        <ReadOutlined className={styles.teamIcon} />
        <Link to={Paths.home}>
          <CustomButton type='text'>
            <Typography.Title level={2}>Манга</Typography.Title>
          </CustomButton>
        </Link>
      </Space>
      {
        user ? (
          <CustomButton 
              type='text' 
              icon={ <LoginOutlined />}
              onClick={ onLogoutClick }>
            Выйти
          </CustomButton>
        ) : (
          <Space>
            <Link to={Paths.register}>
              <CustomButton type='text' icon={ <UserOutlined />}>Зарегистрироваться</CustomButton>
            </Link>
            <Link to={Paths.login}>
              <CustomButton type='text' icon={ <LoginOutlined />}>Войти</CustomButton>
            </Link>
          </Space>
        )
      }

    </Layout.Header>
  )
}
