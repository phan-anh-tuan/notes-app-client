import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap'
import './LoaderButton.css'
export default ({ className, text, loadingText, isLoading, disabled, ...props}) => {
    return(
        <Button
            className={`LoaderButton ${className}`}
            disabled= {disabled || isLoading}
            {...props}
            >
            { isLoading && <Glyphicon glyph="refresh" className="spinning" />}
            { isLoading? loadingText: text}
        </Button>

    )   
}
