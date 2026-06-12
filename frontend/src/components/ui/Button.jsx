import React from 'react'

const Button = ({className, children,onClick,key}) => {
  return (
    <button className={className} onClick={onClick} key={key}>
      {children}
    </button>
  )
}

export default Button
