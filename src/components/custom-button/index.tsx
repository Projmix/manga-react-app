import { Button, Form } from "antd";

type Props = {
    children: React.ReactNode;
    htmlType?:  "button" | "submit" | "reset";
    onClick?: () => void;
    type?: "link" | "text" | "default" | "primary" | "dashed" | undefined;
    danger?: boolean;
    loading?: boolean;
    shape?:  "default" | "circle" | "round" | undefined;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
}

export const CustomButton = (  { children, htmlType = 'button', type, danger, loading, shape, icon, style, className, disabled, onClick }: Props ) => {
  return (
    <Form.Item>
        <Button htmlType={ htmlType } type={ type } danger={ danger } loading={ loading } shape={ shape } icon={ icon } style={ style } className={ className }  disabled={ disabled } onClick={ onClick }>
            { children }
        </Button>
    </Form.Item>
  )
}
