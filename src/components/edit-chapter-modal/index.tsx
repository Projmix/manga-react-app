import React, { useState } from "react";
import { Modal, Form, Input, Upload, message, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { CustomButton } from "../custom-button";
import { useEditChapterMangaMutation } from "../../app/services/chapter-manga";
import { useUploadFileMutation } from "../../app/services/upload";
import { isMessageError } from "../../utils/is-message-error";
import { ErrorMessage } from "../error-message";

interface EditChapterModalProps {
  isOpen: boolean;
  chapterName: string;
  images: string[];
  mangaId: string;
  mangaName: string;
  onClose: () => void;
}

export const EditChapterModal: React.FC<EditChapterModalProps> = ({
  isOpen,
  chapterName,
  images,
  mangaId,
  mangaName,
  onClose,
}) => {
  const [newName, setNewName] = useState<string>(chapterName);
  const [error, setError] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>(formatFileList(images));

  const [editChapterManga] = useEditChapterMangaMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  function formatFileList(images: string[]): UploadFile[] {
    return images.map((url, index) => ({
      uid: String(index),
      name: `image-${index}`,
      status: "done",
      url,
    }));
  }

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handleUploadImages = async (): Promise<string[]> => {
    const imagesToUpload = fileList.filter((file) => !file.url);
    const existingImages = fileList.filter((file) => file.url).map((file) => file.url as string);

    if (imagesToUpload.length > 0) {
      const formData = new FormData();
      imagesToUpload.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      const uploadedUrls = await uploadFile(formData).unwrap();
      return [...existingImages, ...uploadedUrls];
    } else {
      return existingImages;
    }
  };

  const handleSubmit = async () => {
    try {
      const newImages = await handleUploadImages();

      await editChapterManga({
        name: newName,
        files: newImages.join(","),
        mangaId,
        path: mangaName,
      }).unwrap();

      message.success("Глава успешно обновлена!");
      onClose();
    } catch (err) {
      if (isMessageError(err)) {
        setError(`Ошибка обновления главы: ${err.data.message}`);
      } else {
        setError("Неизвестная ошибка");
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      title="Редактировать главу"
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={isUploading}
    >
      <Form layout="vertical">
        <Form.Item label="Название главы">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Изображения">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
            multiple
          >
            <UploadOutlined />
          </Upload>
          <ErrorMessage message={error} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditChapterModal;
