import React from 'react'
import Link from 'next/link'

const NoteFound = () => {
  return (
    <div className = 'container h-screen flex flex-col gap-5 justify-center items-center'>
        <h2>Oops, Not Found URL</h2>
        <p>Maybe you suck</p>
        <Link href="/">Go Back?</Link>
    </div>
  )
}

export default NoteFound