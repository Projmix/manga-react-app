import React, { useState } from 'react';
import { Manga } from "../../types";
import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Card, Form, Space, Upload, message } from "antd";
import { UploadProps } from 'antd';
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { useUploadFileMutation } from "../../app/services/upload";
import { isMessageError } from '../../utils/is-message-error';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';

type Props<T> = {
  onFinish: (values: T) => void;
  btnText: string;
  title: string;
  error?: string;
  manga?: T;
  onClose?: () => void;
}

export const MangaForm = ({
  onFinish,
  title,
  btnText,
  error,
  manga,
  onClose
}: Props<Manga>) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const navigate = useNavigate();

  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Handle file uploads
      if (fileList.length === 0) {
        message.error("Выберите изображение обложки для загрузки");
        return;
      }

      const formData = new FormData();
      fileList.forEach((file: any) => {
        formData.append("files", file.originFileObj);
      });

      const result = await uploadFile(formData).unwrap();
      const imageUrl = result[0]; // Assume the first file is the cover image
      message.success("Файлы успешно загружены!");
      onFinish({ ...values, image: imageUrl });
    } catch (err) {
      if (isMessageError(err)) {
        message.error(`Загрузка не удалась: ${err.data.message}`);
      } else {
        message.error("Неизвестная ошибка");
      }
    }
  };
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`/`);
    }
  };

  return (
    <Card title={title} style={{ width: '30rem' }}>
      <CustomButton className={styles.closeButton} onClick={handleClose}>
      <CloseOutlined />
      </CustomButton>
      <Form name="manga-form" onFinish={handleSubmit} initialValues={manga}>
        <Space direction="vertical" size={"middle"} className={styles.CustomInputSize}>

          <CustomInput type="text" name="title" placeholder="Название" />
          <CustomInput type="text" name="description" placeholder="Описание" />
          <CustomInput type="text" name="genres" placeholder="Жанры" />
          <Upload
            name="files"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Предотвращает автоматическую загрузку
            listType="picture"
          >
            <CustomButton
              icon={<UploadOutlined />}
              disabled={fileList.length > 0}
            >
              Загрузить изображение обложки
            </CustomButton>
          </Upload>
          <CustomButton htmlType="submit" loading={isLoading}>
            {btnText}
          </CustomButton>
          <ErrorMessage message={error} />
        </Space>
      </Form>
    </Card >
  )
}
