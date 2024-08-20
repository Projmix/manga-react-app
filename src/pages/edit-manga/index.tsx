import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { useEditMangaMutation, useGetMangaQuery } from '../../app/services/manga';
import { Layout } from '../../components/layout';
import { MangaForm } from '../../components/manga-form';
import { Manga } from '../../types';
import { Paths } from '../../paths';
import { isMessageError } from '../../utils/is-message-error';
import { Row } from 'antd';
import { ErrorMessage } from '../../components/error-message';
import { CustomButton } from '../../components/custom-button';
import { CloseOutlined } from '@ant-design/icons';

export const EditManga = () => {
    const navigate = useNavigate();
    const params = useParams<{ name: string }>();
    const [error, setError] = useState('');
    const { data, isLoading } = useGetMangaQuery(params.name || "");
    const [editManga] = useEditMangaMutation();

    if (isLoading) {
        return <span>Загрузка</span>
    }

    const handleEditManga = async (manga: Manga) => {
        try {
            const editedManga = {
                ...data,
                ...manga

            }
            console.log(editedManga);
            await editManga(editedManga).unwrap();

            navigate(`${Paths.status}/updated`);
        } catch (err) {
            if (isMessageError(err)) {
                setError(`Ошибка при редактировании манги: ${err.data.message}`);
            } else {
                setError('Неизвестная ошибка');
            }
        }
    }
    const handleBackToManga = () => {
        navigate(`${Paths.manga}/${params.name}`);
    };

    return (
        <Layout>
            <Row align="middle" justify="center">
                <MangaForm
                    title='Редактировать мангу'
                    btnText='Редактировать'
                    error={error}
                    manga={data}
                    onFinish={handleEditManga}
                    onClose={handleBackToManga}
                />
            </Row>
            <ErrorMessage message={error} />
        </Layout>
    )
}
