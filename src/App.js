import React, { useState, useEffect, useCallback } from 'react'
import Unsplash from 'unsplash-js'
import { FaSearch } from 'react-icons/fa'
import './App.css'
import PhotoCard from './components/photo-card'

const unsplash = new Unsplash({
  applicationId: process.env.REACT_APP_APP_ID,
  secret: process.env.REACT_APP_APP_SECRET
})

function App() {
  const [photos, setPhotos] = useState([])
  const [count] = useState(6)
  const [keyWord, setKeyWord] = useState('')
  const [searchTerm, setSearchTerm] = useState(null)
  const [pages] = useState(Math.ceil(Math.random() * 9))
  const [isSearching, setSearching] = useState(false)
  const [fullImage, setFullImage] = useState(null)

  const fetchPhotos = useCallback(
    (searchTerm = 'African') => {
      unsplash.search
        .photos(searchTerm, pages, count)
        .then(res => res.json())
        .then(({ results }) => {
          setSearching(false)
          setPhotos(results)
          console.log(results)
        })
    },
    [count, pages]
  )

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const handleSubmit = async e => {
    e.preventDefault()
    setSearchTerm(null)
    setSearching(true)
    await fetchPhotos(keyWord)
    setSearchTerm(keyWord)
  }

  return (
    <div className='App'>
      {fullImage !== null && (
        <div className='modal'>
          <div className='container'>
            <div className='modal-content'>
              <div className='modal-header'>
                <button className='modal-btn'>&times;</button>
              </div>
              <div className='modal-body'>
                <img
                  src={fullImage.url}
                  alt={fullImage.alt}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: '7px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='backdrop'>
        <div className='container'>
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <FaSearch className='search-icon' />
              <input
                type='search'
                className='search-field'
                placeholder='Search for photo'
                value={keyWord}
                onChange={e => setKeyWord(e.target.value)}
                autoFocus
              />
            </div>
          </form>
          {isSearching}
          <h1 className='text'>
            {isSearching && `Searching for "${keyWord}" `}
            {!isSearching &&
              searchTerm !== null &&
              `Search results for "${searchTerm}" `}
          </h1>
        </div>
      </div>
      <div className='content'>
        <div className='container'>
          <div className='content__inner'>
            {photos.length > 0 &&
              photos.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  setFullImage={setFullImage}
                />
              ))}

            {!photos.length || isSearching ? (
              <>
                <div className='card-loading' />
                <div className='card-loading' />
                <div className='card-loading' />
                <div className='card-loading' />
                <div className='card-loading' />
                <div className='card-loading' />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
