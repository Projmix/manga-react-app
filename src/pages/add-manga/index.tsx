import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout'
import { MangaForm } from '../../components/manga-form'
import { Row } from 'antd'
import { useAddMangaMutation } from '../../app/services/manga'
import { selectUser } from '../../features/auth/authSlice'
import { Manga } from '../../types'
import { Paths } from '../../paths'
import { isMessageError } from '../../utils/is-message-error'
import { ErrorMessage } from '../../components/error-message'

type MangaData = Omit<Manga, "id">

export const AddManga = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const [addManga] = useAddMangaMutation();

    useEffect(() => {
        if(!user){
            navigate('/login');
        }
    }, [navigate, user]);

    const handleAddManga = async (data: MangaData) => {
        try{
            await addManga(data).unwrap();
            navigate(`${Paths.status}/created`)
        }catch(err){
            const maybeError = isMessageError(err);
            if (maybeError){
                setError(err.data.message); 
            } else{
                setError('Неизвестная ошибка');
            }
        }
    }

    return (
        <Layout>
            <Row align='middle' justify='center'>
                <MangaForm
                    title='Добавить мангу'
                    btnText='Добавить'
                    onFinish={ handleAddManga }
                    error={ error }
                />
            </Row>
            <ErrorMessage message={ error } />
        </Layout>
    )
}
