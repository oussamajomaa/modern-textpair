import React from 'react'

export default function SourceAuthor({ text }) {
  return (

      <div className='text-yellow-900'>
        <span> {text.source_author} </span>,
        <span> {text.source_year} </span>,
        <span> {text.source_title} </span>,
        <span> {text.source_length} </span>
        - <span> {text.source_genre} </span> -
      </div>

  )
}
