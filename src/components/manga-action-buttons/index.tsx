import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";
import { CustomButton } from "../custom-button";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface ActionButtonsProps {
  mangaTitle: string;
  showModal: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ mangaTitle, showModal }) => {
  return (
    <Space>
      <Link to={`/manga/${mangaTitle}/add`}>
        <CustomButton shape="round" type="default" icon={<PlusOutlined />}>
          Новая глава
        </CustomButton>
      </Link>
      <Link to={`/manga/edit/${mangaTitle}`}>
        <CustomButton shape="round" type="default" icon={<EditOutlined />}>
          Редактировать
        </CustomButton>
      </Link>
      <CustomButton shape="round" danger onClick={showModal} icon={<DeleteOutlined />}>
        Удалить
      </CustomButton>
    </Space>
  );
};
