import React from 'react'

const Input = ({className, type, placeholder, onChange, value, style}) => {
  return (
    <input
     type={type}
     className={className}
     placeholder={placeholder}
     onChange={onChange}
     value={value}
     style={style} />
  )
}

export default Input