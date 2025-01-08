"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useRouter } from "next/navigation"
import React from "react"

export default function Home() {

  const [projectdata, setProjectData] = useState([])
  const [projectName,setProjectName] = useState("")
  const [description,setdescription] = useState("")

  const router = useRouter()

  // fetch all the project details
  useEffect(() => {
    async function fetchProjectDetail(){
      try {

        const res = await fetch("/api/fetchProject")

        if(res.status != 200){
           console.log(res)
        }

        const data = await res.json()

        setProjectData(data?.data)
        
      } catch (error) {
        console.log(error ?? "Server Internal issue")
      }
    }
    fetchProjectDetail()
  },[])

  // cretae a new Project 
  async function createProject(){
    try {

      const res = await fetch("/api/createProject",{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({ projectName, description })
      })
  
      if(res.status != 201){
        console.log(res ?? "failed to Create")
      }

      console.log("res",res)
      
    } catch (error) {
      console.log(error ?? "Inter Server Issue")
    }
  }

  function makeShort(text : string,minlen : number){

    if(minlen >= text.length){
      return text
    }

    return text.slice(0,minlen)+"..."
  }

  function moveToworkflow(projectID : string){
    //  router.replace(`/workspace/${projectID}`)
    router.push(`/workspace/${projectID}`)
  }

    return (
      <div className="min-h-screen">
        <h1 className="text-center pt-5 text-2xl">Project <span className="bg-yellow-300 px-1 ">details</span></h1>
        <div className="flex-col justify-center">
            <div className='flex gap-16 justify-center pt-10 border-b border-black'>
              <p>Index</p>
              <p>Project Name</p>
              <p>Project Desc..</p>
              <p>created At</p> 
            </div>

            {projectdata ? (
              <div>
              {projectdata.map((projectdatafeild : any,idx : number) => (
                <div className="flex border-b border-black gap-20 cursor-pointer text-sm justify-center pt-5" key={idx} onClick={() => moveToworkflow(projectdatafeild?._id)}>
                    <p>{idx}</p>
                    <p>{projectdatafeild?.projectName}</p>
                    <p>{makeShort(projectdatafeild?.description,15) ?? "-"}</p>
                    <p>{projectdatafeild?.created_At ?? "-"}</p>
                </div>
                ))}
              </div>
            ) :
            (
              <div>
                <p>No Previous Project! , Create a new one.</p>
              </div>
            )}

          <div className="flex justify-center pt-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Project</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    )
  }