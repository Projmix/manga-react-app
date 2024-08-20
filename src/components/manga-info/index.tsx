import React from "react";
import { Descriptions, Card, Space } from "antd";
import styles from './index.module.css';

interface MangaInfoProps {
  description: string;
  genres: string;
}

export const MangaInfo: React.FC<MangaInfoProps> = ({ description, genres }) => {
  return (
    <Descriptions bordered column={1} className={styles.mangaInfo}>
      <Descriptions.Item label="Описание">{description}</Descriptions.Item>
      <Descriptions.Item label="Жанры">
        <Space wrap>
          {genres.split(",").map((genre) => (
            <Card key={genre} style={{ marginBottom: 5 }}>{genre}</Card>
          ))}
        </Space>
      </Descriptions.Item>
    </Descriptions>
  );
};
