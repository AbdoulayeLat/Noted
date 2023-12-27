"use client"

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';

export default function Home() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);

  const renderNotes = async () => {
    let url = 'http://localhost:3001/notes';
    const res = await fetch(url);
    const notes = await res.json();
    setNotes(notes);
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(renderNotes(), 5000);
  },[])

  return (
    <div className='flex flex-col w-[100vw] h-[100vh]'>
      {/* Navbar */}
      <div className='flex flex-row justify-between items-center mx-20 mt-15 border-b-2'>
        <p className='font-bold text-[70px] tracking-wide'>Notes</p>
        <div className='flex items-center p-1 rounded-lg cursor-pointer bg-yellow-400 text-black w-fit h-fit hover:text-yellow-400 
                      hover:border-yellow-400 hover:border-2 hover:bg-black'>
          <p className='font-normal text-[30px]'>New Note</p>
          <AddIcon fontSize='large' />
        </div>
      </div>

      {/* Body */}
      <div className='h-[100%] mx-20 mb-5 mt-5 overflow-y-auto'>
        {loading && 
          <div className='flex justify-center items-center w-[100%] h-[100%]'>
            <p className='text-[40px] opacity-55 font-bold'>Gathering your notes...</p>
          </div> 
        }
        {!loading && 
          <div className='grid grid-cols-4 gap-5'>
            {notes === null ? <p className='font-light text-[30px] self-center'>No Notes. Create a new one</p> 
            : notes.length === 0 ? <p className='font-light text-[30px] self-center'>No Notes. Create a new one</p> 
            : notes.map((note) =>
              <div id={note.id} className='border-2 w-[300px] h-[300px] border-yellow-400 rounded-lg p-2 flex flex-col justify-between'>
                <p className='text-[30px] font-semibold bg-yellow-400 bg-opacity-55 rounded-sm flex justify-center'>{note.title}</p>
                <p className='text-[18px] overflow-hidden line-clamp-4'>{note.content}</p>
                <div className='flex gap-4 justify-end'>
                  <DeleteIcon fontSize='medium' color='error' sx={{cursor:"pointer"}} />
                  <EditIcon fontSize='medium' sx={{color:"rgb(250 204 21)", cursor:"pointer"}} />
                </div>
              </div> 
            )}
          </div>
        }
      </div>
    </div>
  )
}
