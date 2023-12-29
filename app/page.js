"use client"

import {v4 as uuidV4} from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import {NextUIProvider } from "@nextui-org/react"; 
import {Modal, ModalContent, ModalHeader, ModalBody,  ModalFooter, Button, Textarea, useDisclosure} from "@nextui-org/react";
import apiRequest from '@/apiRequest';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteWarning, setNoteWarning] = useState("none");
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const {onOpenChange} = useDisclosure();
  let url = 'https://my-json-server.typicode.com/abdoulayelat/note-server/db';

  const deleteNote = async (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);

    const deleteOptions = {method:"DELETE"};
    const reqURL = `${url}/${id}`;
    const result = await apiRequest(reqURL, deleteOptions);
  }

  const addNote = async (note) => {
    if(title === "" || content === ""){
      setNoteWarning("block");
    }else{
      const id = uuidV4();
      const newNote = {id:id, title:note.title, content:note.content};
      const newNotes = [...notes, newNote];
      setNotes(newNotes);
  
      const postOptions = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(newNote)
      }
      const result = await apiRequest(url, postOptions);
      setOpenCreate(false);
      setNoteWarning("none");
      setTitle("");
      setContent("");
    }
  }

  const updateNote = async (id) => {
    var newNotes = notes;
    if (title !== "" && content !== "") {
      newNotes = notes.map((note) => note.id === id ? {id:id, title: title, content:content } : note);
    }else if(title !== ""){
      newNotes = notes.map((note) => note.id === id ? {id:id, ...note, title: title} : note);
    }else if(content !== ""){
      newNotes = notes.map((note) => note.id === id ? {id:id, ...note, content:content } : note);
    }else{
      return newNotes;
    }
    
    setNotes(newNotes);

    const newNote = newNotes.filter((note) => note.id === id);
    const updateOptions = {
      method:"PATCH",
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({title: newNote[0].title, content:newNote[0].content})
    }
    const reqURL = `${url}/${id}`;
    const result = await apiRequest(reqURL, updateOptions);
    setOpenEdit(false)
  }

  useEffect(() => {
    const renderNotes = async () => {
      const res = await fetch(url);
      const notes = await res.json();
      setNotes(notes);
      setLoading(false);
    }
    renderNotes();
  },[])

  return (
    <NextUIProvider>
      <div className='flex flex-col w-[100vw] h-[100vh]'>
        {/* Navbar */}
        <div className='flex flex-row justify-between items-center mx-20 mt-15 border-b-2'>
          <p className='font-bold text-[70px] tracking-wide'>Notes</p>
          {/* Create Button */}
          <div onClick={()=>setOpenCreate(true)} className='flex items-center p-1 rounded-lg cursor-pointer bg-yellow-400 text-black w-fit h-fit hover:text-yellow-400 
                        hover:border-yellow-400 hover:border-2 hover:bg-[#784BA0]'>
            <p className='font-normal text-[30px]'>New Note</p>
            <AddIcon fontSize='large' />
          </div>
        </div>

        {/* Body */}
        <div className='h-[100%] mx-20 mb-5 mt-5 overflow-y-auto'>
          {/* Create Note Modal */}
          <Modal hideCloseButton backdrop='blur' isOpen={openCreate} onOpenChange={onOpenChange} size='4xl' className='h-[80vh] border-yellow-400 border-2'>
            <ModalContent className='bg-inherit bg-img-inherit'>
              <ModalHeader className='border-yellow-400 border-b-2 flex items-center mx-5'>
                <input onChange={(e)=>setTitle(e.target.value)} autoFocus type="text" className='bg-slate-300 text-black text-[40px] font-normal w-[100%] mr-5 p-2 rounded-md' placeholder='Note title...' />
                <Button onClick={()=>setOpenCreate(false)} color='danger'>X</Button>
              </ModalHeader>
              <ModalBody>
                <Textarea size='lg' onChange={(e)=>setContent(e.target.value)} variant='faded' label='Your note' classNames={{input:"text-md font-light text-black mt-2", inputWrapper:"bg-slate-300 border-yellow-400" }} isRequired placeholder='Enter your note' />
              </ModalBody>
              <ModalFooter className='border-yellow-400 border-t-2 flex mx-5'>
                <p className='text-red-500 font-bold text-[25px]' style={{display:noteWarning}}>Please fill in the note!</p>
                <Button className='w-[50px] h-[50px] text-[25px] font-bold flex place-self-end ' onClick={()=>addNote({title:title, content:content })} color='success'>Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          

          {loading && 
            <div className='flex justify-center items-center w-[100%] h-[100%]'>
              <p className='text-[40px] opacity-55 font-bold'>Gathering your notes...</p>
            </div> 
          }
          {!loading &&      
            <div className='grid grid-cols-3 gap-5 w-[100%]'>
              {notes === null ? <p className='font-light text-[30px] self-center'>No Notes. Create a new one</p> 
              : notes.length === 0 ? <p className='font-light text-[30px] self-center'>No Notes. Create a new one</p> 
              : notes.map((note) =>
                  <div id={note.id} className='border-2 w-[100%] h-[300px] border-yellow-400 rounded-lg p-2 flex flex-col justify-between'>
                    {/* Update Note Modal */}
                    <Modal hideCloseButton backdrop='blur' isOpen={openEdit} onOpenChange={onOpenChange} size='4xl' className='h-[80vh] border-yellow-400 border-2'>
                      <ModalContent className='bg-inherit bg-img-inherit'>
                        <ModalHeader className='border-yellow-400 border-b-2 flex items-center mx-5'>
                          <input onChange={(e)=>setTitle(e.target.value)} defaultValue={note.title} autoFocus type="text" className='bg-slate-300 text-black text-[40px] font-normal w-[100%] mr-5 p-2 rounded-md' placeholder='Note title...'  />
                          <Button onClick={()=>setOpenEdit(false)} color='danger'>X</Button>
                        </ModalHeader>
                        <ModalBody>
                          <Textarea onChange={(e)=>setContent(e.target.value)} variant='faded' label='Your note' defaultValue={note.content} classNames={{input:"text-md font-light text-black mt-2", inputWrapper:"bg-slate-300 border-yellow-400" }} isRequired placeholder='Enter your note' />
                        </ModalBody>
                        <ModalFooter className='border-yellow-400 border-t-2 flex mx-5'>
                          <Button className='w-[50px] h-[50px] text-[25px] font-bold flex place-self-end ' onClick={()=>updateNote(note.id)} color='success'>Save</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    <p className='text-[30px] font-semibold bg-yellow-400 bg-opacity-55 line-clamp-1 overflow-hidden w-[100%] h-[30%] rounded-sm flex items-center justify-center'>{note.title}</p>
                    <p className='text-[18px] overflow-hidden line-clamp-4'>{note.content}</p>
                    <div className='flex gap-4 justify-end'>
                      <DeleteIcon onClick={()=>deleteNote(note.id)} fontSize='large' color='error' sx={{cursor:"pointer", ":hover":{background:"rgb(114, 118, 119, 0.6)", padding:"2px", borderRadius: "10px"} }} />
                      <EditIcon onClick={()=>setOpenEdit(true)} fontSize='large' sx={{color:"rgb(250 204 21)", cursor:"pointer", ":hover":{background:"rgb(114, 118, 119, 0.6)", padding:"2px", borderRadius: "10px"}}} />
                    </div>
                  </div> 
              )}
            </div>
          }
        </div>
      </div>
    </NextUIProvider>
  )
}
