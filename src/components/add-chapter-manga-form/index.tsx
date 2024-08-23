import React, { useState } from "react";
import { Chapters } from "../../types";
import { Card, Form, Input, Space, Switch, Upload, message, Progress, Layout, Tooltip } from "antd";
import { CloseOutlined, LinkOutlined, UploadOutlined } from "@ant-design/icons";
import { CustomInput } from "../custom-input";
import { ErrorMessage } from "../error-message";
import { CustomButton } from "../custom-button";
import { useUploadFileMutation, useUploadUrlMutation } from "../../app/services/upload";
import { isMessageError } from "../../utils/is-message-error";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import styles from "./index.module.css";

interface AddChapterMangaFormProps {
  onFinish: (values: Omit<Chapters, "id"> & { path: string }) => void;
  onClose: () => void;
  btnText: string;
  title: string;
  error?: string;
  chapter?: Omit<Chapters, "id"> & { path: string };
}

export const AddChapterMangaForm: React.FC<AddChapterMangaFormProps> = ({
  onFinish,
  onClose,
  title,
  btnText,
  error,
  chapter = {} as Omit<Chapters, "id"> & { path: string },
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);
  const [url, setUrl] = useState<string>("");
  const [uploadFromUrl, setUploadFromUrl] = useState<boolean>(false);
  const [uploadFile, { isLoading: isFileUploading }] = useUploadFileMutation();
  const [uploadUrl, { isLoading: isUrlUploading }] = useUploadUrlMutation();

  const handleUploadChange = ({ fileList }: { fileList: UploadFile<RcFile>[] }) => {
    setFileList(fileList);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (uploadFromUrl) {
        if (!url) {
          message.error("Введите URL-адрес");
          return;
        }
        const result = await uploadUrl({ url, selector: values.selector }).unwrap();
        message.success("Загрузка URL-адреса прошла успешно!");
        onFinish({ ...chapter, ...values, files: result.toString() });
      } else {
        if (fileList.length === 0) {
          message.error("Выберите файлы для загрузки");
          return;
        }

        const formData = new FormData();
        fileList.forEach(file => {
          if (file.originFileObj) {
            formData.append("files", file.originFileObj); // Only append if originFileObj is defined
          }
        });

        const result = await uploadFile(formData).unwrap();
        message.success("Файлы успешно загружены!");
        onFinish({ ...chapter, ...values, files: result.toString() });
      }
    } catch (err) {
      if (isMessageError(err)) {
        message.error(`Загрузка не удалась: ${err.data.message}`);
      } else {
        message.error("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <Card title={title} style={{ width: "30rem" }}>
      <CustomButton className={styles.closeButton} onClick={onClose}>
        <CloseOutlined />
      </CustomButton>
      <Form form={form} name="chapter-manga-form" onFinish={handleSubmit} initialValues={chapter}>
        <Layout style={{ background: "none" }}>

          <Space direction="vertical" size="middle">
            <CustomInput type="text" name="name" placeholder="Chapter Name" />
            <Switch
              checked={uploadFromUrl}
              onChange={() => setUploadFromUrl(!uploadFromUrl)}
              checkedChildren="URL"
              unCheckedChildren="Upload"
            />
            {uploadFromUrl ? (
              <>
                <CustomInput required={false} type="text" name="selector" placeholder="Name selector: img" />
                <Input
                  prefix={<LinkOutlined />}
                  placeholder="Enter URL"
                  value={url}
                  onChange={handleUrlChange}
                />
              </>
            ) : (
                              <Tooltip placement="right" title={<span>.jpg,.jpeg,.png,.zip,.rar</span>}>

              <Upload
                name="files"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                multiple
                accept=".jpg,.jpeg,.png,.zip,.rar"
              >
                  <CustomButton icon={<UploadOutlined />}>Загрузить файлы</CustomButton>
              </Upload>
              </Tooltip>

            )}
            <ErrorMessage message={error} />
            <CustomButton htmlType="submit" loading={isFileUploading || isUrlUploading}>
              {btnText}
            </CustomButton>

          </Space>
        </Layout>
      </Form>
    </Card>
  );
};
