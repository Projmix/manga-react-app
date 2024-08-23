import { PlusCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "../../components/custom-button";
import { Layout } from "../../components/layout";
import { Card, Row, Col, Space } from "antd";
import { useGetAllMangaQuery } from "../../app/services/manga";
import type { Manga as MangaBD } from "../../types";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../paths";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useEffect } from "react";
import styles from './index.module.css';

export const Manga = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { data, isLoading } = useGetAllMangaQuery();

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user]);

  const goToAddUser = () => navigate(Paths.mangaAdd);

  const renderMangaGrid = (mangaList: MangaBD[]) => {
    return (
      <Row gutter={[16, 16]}>
        {mangaList.map(manga => (
          <Col
            key={manga.id}
            xs={24}   
            sm={12}    
            md={8}    
            lg={6}    
            xl={4} 
          >
            <Card
              hoverable
              cover={<img alt={manga.title} src={manga.image} />}
              onClick={() => navigate(`${Paths.manga}/${manga.title}`)}
            >
              <Card.Meta title={manga.title} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Layout>
      <Space direction="vertical">
        <CustomButton type="primary" onClick={goToAddUser} icon={<PlusCircleOutlined />}>
          Добавить мангу
        </CustomButton>
        {isLoading ? (
          <span>Загрузка...</span>
        ) : (
          renderMangaGrid(data || [])
        )}
      </Space>
    </Layout>
  )
}
