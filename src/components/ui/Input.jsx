import React from 'react'

const Input = ({className,type,placeholder}) => {
  return (
    <input type={type} className={className} placeholder={placeholder} />
  )
}

export default Input