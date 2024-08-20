import React, { useState } from 'react'
import { Layout } from '../../components/layout';
import { Row, Card, Form, Typography, Space } from 'antd';
import { CustomInput } from '../../components/custom-input';
import { PasswordInput } from '../../components/password-input/input';
import { CustomButton } from '../../components/custom-button';
import { Link, useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { useRegisterMutation } from '../../app/services/auth';
import { User } from '../../types';
import { isMessageError } from '../../utils/is-message-error';
import { ErrorMessage } from '../../components/error-message';
import styles from './index.module.css';

type RegisterData = Omit<User, "id"> & { confirmPassword: string }

export const Register = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [error, setError] = useState('');
  const [registerUser] = useRegisterMutation();

  const register = async (data: RegisterData) => {
    try {
      await registerUser(data).unwrap();

      navigate('/');
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка регистрации: ${err.data.message}`);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  }

  return (
    <Layout>
      <Row align="middle" justify="center">
        <Card title="Зарегистрируйтесь" style={{ width: "30rem" }}>
          <Form onFinish={register}>
            <Space size="middle" direction="vertical" className={styles.titleSize}>

              <CustomInput name='name' placeholder='Имя' />
              <CustomInput type='email' name='email' placeholder='Email' />
              <PasswordInput name='password' placeholder='Пароль' />
              <PasswordInput name='confirmPassword' placeholder='Повторите пароль' />
              <CustomButton type='primary' htmlType='submit'>
                Зарегистрироваться
              </CustomButton>
            </Space>
          </Form>
          <Space direction='vertical' size='large'>
            <Typography.Text>
              Есть аккаунт? <Link to={Paths.login}>Войдите</Link>
            </Typography.Text>
            <ErrorMessage message={error} />
          </Space>
        </Card>
      </Row>
    </Layout>
  )
}
