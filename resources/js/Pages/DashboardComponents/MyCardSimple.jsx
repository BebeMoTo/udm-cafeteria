import React from 'react'

const MyCardSimple = ({pesoSign, number, title}) => {
  return (
    <div className='glassMo'>
        <h1>{pesoSign} {number}</h1>
        <b>{title}</b>
    </div>
  )
}

export default MyCardSimple