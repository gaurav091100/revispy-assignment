import React from 'react';

interface INavIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  icon: string;
}

const NavIcon: React.FC<INavIconProps> = ({ icon, ...imgProps }) => {
  return (
    <div>
      <img src={icon} alt="icon" height="32px" width="32px" {...imgProps} />
    </div>
  );
};

export default NavIcon;
