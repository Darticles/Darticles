import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

export default class ImageDropzone extends Component {
    constructor() {
      super()
    }
  
    render() {
      const { onImageSelected, image } = this.props

      return (
        <section>
          <div className="dropzone">
            <Dropzone
              accept="image/jpeg, image/png"
              onDrop={(accepted, rejected) => { 
                onImageSelected(accepted[0])
              }}
            >
              {() => {
                if (image) {
                  return (
                    <img 
                      style={{
                        "width"       : "inherit", 
                        "height"      : "inherit", 
                        "object-fit"  : "cover"
                      }}
                      src={image.preview} 
                      alt="An image" 
                      />
                  )
                } else {
                  return (
                    <span>
                      <p>Try dropping an image here, or click to select a file to upload.</p>
                      <p>Only *.jpeg and *.png images will be accepted</p>
                    </span>
                  )
                }
              }}
            </Dropzone>
          </div>
        </section>
      );
    }
  }