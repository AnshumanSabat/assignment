import { useEffect, useReducer, useState, useCallback, useMemo } from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'

function reducer(favourites, action) {
  if (favourites.includes(action.id)) {
    let y = [];
    for (let id of favourites) {
      if (id !== action.id) {
        y.push(id)
      }
    }
    return y;
  }
  return [...favourites, action.id]
}



function App() {
  const { photos, loading, error } = useFetchPhotos();
  const [favourites, setFavourites] = useReducer(reducer, JSON.parse(localStorage.getItem('favourites') || '[]'));
  const [search, setSearch] = useState('');

  const handler = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const filter = useMemo(() => {
    return photos.filter((x) =>
      x.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);


  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <nav className="flex items-center justify-center bg-surface px-6 py-3 border-b border-accent">
          <input
            type="text"
            placeholder="Search by author..."
            value={search}
            onChange={handler}
            className="rounded-lg border border-surface bg-accent px-10 w-[30%] py-2"
          />
        </nav>

        <div className="flex flex-1 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      </div>

    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <nav className="flex items-center justify-center bg-surface px-6 py-3 border-b border-accent">
          <input
            type="text"
            placeholder="Search by author..."
            className="rounded-lg border border-surface bg-accent px-10 w-[30%] py-2 md:"
          />
        </nav>

        <div className="flex flex-1 items-center justify-center">
          <h1 className='text-red-600 text-3xl font-bold'>Failed to load </h1>
        </div>
      </div>
    );
  }




  return (
    <>
      <div className='bg-bg min-h-screen'>
        <nav className="flex items-center justify-center bg-surface px-6 py-3  border-b border-accent">
          <input
            type="text"
            placeholder="Search by author..."
            value={search}
            onChange={handler}
            className="rounded-lg border border-surface bg-accent px-10 w-full sm:w-[70%] md:w-[50%] lg:w-[30%] py-2"
          />
        </nav>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 px-5'>
          {filter.map((x) => (
            <div key={x.id} className="rounded-lg border p-3 bg-surface border-accent hover:scale-105 transition-all duration-400   ">
              <img
                src={x.download_url}
                alt={x.author}
                loading="lazy"
                className="h-[75%] w-full rounded-lg object-cover border border-accent"
              />
              <div className='flex  w-full items-center justify-between '>
                <h1 className="mt-2 text-accent font-extrabold italic text-sm">{x.author}</h1>
                <button className='' onClick={() => {
                  setFavourites({ id: x.id });
                }} > {favourites.includes(x.id) ? '❤️' : '🤍'}</button>
              </div>
            </div>
          ))

          }

        </div>

      </div>
    </>
  )
}


export default App
