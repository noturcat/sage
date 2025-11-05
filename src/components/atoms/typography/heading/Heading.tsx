import React from 'react';
import style from './Heading.module.scss';

type HeadingProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  color?: 'green' | 'black'
  fontWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  children: React.ReactNode
  extraClass?: string
}

const Heading = ({ as, children, color = 'green', fontWeight = 'normal', extraClass }: HeadingProps) => {
  const HeaderTag = as as React.ElementType;

  return (
    <HeaderTag className={`${style.heading} ${style[color]} ${style[`fw-${fontWeight}`]} ${extraClass ? extraClass : ''}`}>
      {children}
    </HeaderTag>
  );
}

export default Heading

