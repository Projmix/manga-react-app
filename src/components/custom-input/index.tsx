import { Form, Input } from 'antd';

type Props ={
    name: string;
    placeholder: string;
    type?: string;
    required?: boolean; 
}

export const CustomInput = ({
    name,
    placeholder,
    type = 'text',
    required = true,
}: Props) => {
  return (
    <Form.Item 
      name={name} 
      rules={required ? [{required:true, message: 'Обязательое поле'}] : []} 
      shouldUpdate={ true }
    >
        <Input placeholder={ placeholder } type={ type } size='large'/>
    </Form.Item>
  )
}
