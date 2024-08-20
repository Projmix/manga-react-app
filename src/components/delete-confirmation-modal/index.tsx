import React from "react";
import { Modal } from "antd";
import { Chapters } from "../../types";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  chapterToDelete?: Chapters | null;
  mangaTitle?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  chapterToDelete,
  mangaTitle
}) => {
  return (
    <Modal
      title={chapterToDelete ? "Подтвердите удаление главы" : "Подтвердите удаление манги"}
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Подтвердить"
      cancelText="Отменить"
    >
      {chapterToDelete
        ? `Вы действительно хотите удалить главу ${chapterToDelete.name}?`
        : `Вы действительно хотите удалить мангу ${mangaTitle}?`}
    </Modal>
  );
};
