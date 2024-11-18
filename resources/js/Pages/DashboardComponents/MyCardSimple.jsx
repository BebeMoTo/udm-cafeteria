import React from 'react'

const MyCardSimple = ({number, title}) => {
  return (
    <div className='glassMo'>
        <h1>{number}</h1>
        <b>{title}</b>
    </div>
  )
}

export default MyCardSimple