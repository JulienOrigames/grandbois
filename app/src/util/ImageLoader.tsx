import {FC, useRef} from 'react'

type Props = {
  images: string[]
  onImagesLoad?: () => void
}

const ImagesLoader: FC<Props> = ({images, onImagesLoad}) => {
  const loadCount = useRef(0)
  const onLoad = () => {
    loadCount.current++
    if (onImagesLoad && loadCount.current === images.length) {
      onImagesLoad()
    }
  }
  return (
    <>
      {images.map((image, index) => <img key={index} src={image} alt='' style={{display: 'none'}} onLoad={onLoad}/>)}
    </>
  )
}

export default ImagesLoader