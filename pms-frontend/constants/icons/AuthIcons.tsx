import React from 'react';

interface IconProps {
    size?: number;
    color?: string;
    className?: string;
}

const MaterialIcon: React.FC<IconProps & { name: string }> = ({ name, size = 24, color = "currentColor", className = "" }) => (
    <span
        className={`material-symbols-outlined ${className}`}
        style={{
            fontSize: size,
            color: color,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size,
            height: size,
            userSelect: 'none'
        }}
    >
        {name}
    </span>
);

export const LogoIcon = (props: IconProps) => <MaterialIcon {...props} name="architecture" size={props.size || 20} />;
export const MailIcon = (props: IconProps) => <MaterialIcon {...props} name="mail" size={props.size || 18} />;
export const LockIcon = (props: IconProps) => <MaterialIcon {...props} name="lock" size={props.size || 18} />;
export const EyeIcon = (props: IconProps) => <MaterialIcon {...props} name="visibility" size={props.size || 18} />;
export const EyeOffIcon = (props: IconProps) => <MaterialIcon {...props} name="visibility_off" size={props.size || 18} />;
export const AlertCircleIcon = (props: IconProps) => <MaterialIcon {...props} name="error" size={props.size || 18} />;
export const ChartIcon = (props: IconProps) => <MaterialIcon {...props} name="monitoring" size={props.size || 20} />;
export const ShieldIcon = (props: IconProps) => <MaterialIcon {...props} name="shield" size={props.size || 20} />;
export const CheckCircleIcon = (props: IconProps) => <MaterialIcon {...props} name="check_circle" size={props.size || 20} />;
export const GoogleIcon = (props: IconProps) => <MaterialIcon {...props} name="login" size={props.size || 18} />; // Generic login for brand compliance if specific not found
export const LinkedInIcon = (props: IconProps) => <MaterialIcon {...props} name="share" size={props.size || 18} />;
export const ArrowRightIcon = (props: IconProps) => <MaterialIcon {...props} name="arrow_forward" size={props.size || 18} />;
export const RefreshIcon = (props: IconProps) => <MaterialIcon {...props} name="refresh" size={props.size || 18} />;
export const BadgeCheckIcon = (props: IconProps) => <MaterialIcon {...props} name="verified" size={props.size || 24} />;
export const KeyResetIcon = (props: IconProps) => <MaterialIcon {...props} name="lock_reset" size={props.size || 24} />;
