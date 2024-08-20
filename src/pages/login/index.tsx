import { useState } from 'react';
import { Layout } from '../../components/layout';
import { Row, Card, Form, Typography, Space } from 'antd';
import { CustomInput } from '../../components/custom-input';
import { PasswordInput } from '../../components/password-input/input';
import { CustomButton } from '../../components/custom-button';
import { Link, useNavigate } from 'react-router-dom';
import { Paths } from '../../paths';
import { UserData, useLoginMutation } from '../../app/services/auth';
import { isMessageError } from '../../utils/is-message-error';
import { ErrorMessage } from '../../components/error-message';
import styles from './index.module.css';




export const Login = () => {
  const navigate = useNavigate();
  const [loginUser, loginUserResult] = useLoginMutation();
  const [error, setError] = useState('');

  const login = async (data: UserData) => {
    try {
      await loginUser(data).unwrap();

      navigate("/");
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка логирования: ${err.data.message}`);
      } else {
        setError('Неизвестная ошибка');
      }
    }
  }

  return (
    <Layout>
      <Row align="middle" justify="center">
        <Card title="Войдите" style={{ width: "30rem" }}>
          <Form onFinish={login}>
            <Space size="middle" direction="vertical" className={styles.titleSize}>

              <CustomInput type='email' name='email' placeholder='email' />
              <PasswordInput name='password' placeholder='Пароль' />
              <CustomButton type='primary' htmlType='submit' loading={loginUserResult.isLoading}>
                Войти
              </CustomButton>
            </Space>
          </Form>
          <Space direction='vertical' size='large'>
            <Typography.Text>
              Нет аккаунта? <Link to={Paths.register}>Зарегистрируйтесь</Link>
            </Typography.Text>
            <ErrorMessage message={error} />
          </Space>
        </Card>
      </Row>
    </Layout>
  )
}
