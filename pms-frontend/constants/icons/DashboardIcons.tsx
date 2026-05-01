import React from 'react';

interface IconProps {
    size?: number;
    color?: string;
    className?: string;
}

const MaterialIcon: React.FC<IconProps & { name: string }> = ({ name, size = 24, color = "currentColor", className }) => (
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

export const LogoIcon: React.FC<IconProps> = (props) => (
    <div className="bg-[#3525CD] rounded-lg p-1 flex items-center justify-center" style={{ width: props.size, height: props.size }}>
        <MaterialIcon {...props} name="domain" color="white" size={(props.size || 32) * 0.7} />
    </div>
);

export const PriceIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="payments" />;
export const GridIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="grid_view" />;
export const BuildingIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="apartment" />;
export const UsersIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="group" />;
export const ClipboardIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="assignment" />;
export const SettingsIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="settings" />;
export const HelpIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="help" />;
export const LogoutIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="logout" />;
export const BellIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="notifications" />;
export const BusinessIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="corporate_fare" />;
export const SearchIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="search" />;
export const TrendUpIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="trending_up" />;
export const FolderIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="folder" />;
export const EyeIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="visibility" size={18} />;
export const EditIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="edit" size={18} />;
export const SparklesIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="auto_awesome" color="" />;
export const ArrowUpIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="arrow_upward" />;
export const ArrowDownIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="arrow_downward" />;
export const QRCodeIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="qr_code_2" />;
export const MailIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="mail" />;
export const CalendarIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="calendar_today" />;
export const FilterIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="filter_list" />;
export const ReceiptIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="receipt_long" />;
export const CheckCircleIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="check_circle" />;
export const ErrorIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="error" />;
export const RefreshIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="refresh" />;
export const ArrowForwardIcon: React.FC<IconProps> = (props) => <MaterialIcon {...props} name="arrow_forward" />;
