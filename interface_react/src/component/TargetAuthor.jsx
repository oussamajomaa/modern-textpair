import React from 'react'

export default function TargetAuthor({ text }) {
    return (
            <div className=' text-yellow-900'>
                <span> {text.target_author}</span>,
                <span>{text.target_year}</span>,
                <span> {text.target_title}</span>,
                <span> {text.target_length} </span>
                - <span> {text.target_genre} </span> -
            </div>
    )
}
