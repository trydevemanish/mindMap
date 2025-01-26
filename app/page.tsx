"use client"
import { Star } from "lucide-react"
import React from "react"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Loader2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const [projectdata, setProjectData] = useState([])
  const [projectName,setProjectName] = useState("")
  const [description,setdescription] = useState("")

  const [newProjectCreated,setNewProjectCreated] = useState(false)
  const [projectDeleted,setProjectDeletd] = useState(false);
  const [updatingProjectName,setUpdatingProjectName] = useState(false)
  const [darkTheme,setDarkTheme] = useState("")
  const [stateButtonLoaded,setStateButtonLoaded] = useState(false)

    const { toast } = useToast()
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
    },[newProjectCreated,projectDeleted,updatingProjectName])


    // create a new Project 
    async function createProject(){
      try {

        setStateButtonLoaded(true)

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

        const data = await res.json()

        setNewProjectCreated(!newProjectCreated)

        toast({
          title : data?.message,
          className:"w-[300px] text-sm font-light"
        }) 

        setStateButtonLoaded(false)
                
      } catch (error) {
        console.log(error ?? "Internal Server Issue")
      }
    }

    // delete a Project
    async function deleteProject(projectid : string) {
       try {

        const res = await fetch(`/api/deleteProject/${projectid}`,{
          method : "DELETE"
        })

        if(res.status != 200){
          console.log(res)
        }

        const data = await res.json()

        setProjectDeletd(!projectDeleted)

        toast({
          title : data?.message,
          className:"w-[300px] text-sm font-light"
        })
        
       } catch (error) {
          console.log(error ?? "Inter Server Issue")
       }
    }

    // update Project Name 
    async function updateProjectName(projectid:string,newProjectName : string) {
      try {

        const res = await fetch(`/api/changeProjectName/${projectid}`,{
          method : "PUT",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ newProjectName })
        })

        if(res.status != 200){
          console.log(res)
        }

        const data = await res.json()

        toast({
          title : data?.message,
          className:"w-[300px] text-sm font-light"
        })

        setUpdatingProjectName(!updatingProjectName)
        
      } catch (error) {
        console.log(error ?? "Internal Server Error")
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

    const handleThemeFormat = (theme : 'dark' | 'light') => {
      if(theme === 'dark'){
        toast({
          title : `Theme Switched to ${theme}`,
          className:"w-[300px] text-sm font-thin"
        })
        setDarkTheme(theme)
      } else {
        toast({
          title : `Theme Switched to ${theme}`,
          className:"w-[300px] text-sm font-light"
        })
        setDarkTheme(theme)
      }
    }


  return(
    <main className={`${darkTheme == 'dark' ? 'dark' : 'light'}`}>
      <div className="grid grid-cols-[16vw_1fr] min-h-screen overflow-hidden dark:border-white dark:text-white dark:bg-black">

          {/* sidebar part  */}
          <div className="min-h-screen border-r dark:border-white border-black text-sm px-4 py-3">
            {/* <h2 className="border-b px-2 py-1">Templates</h2>
            <div className="flex flex-col pl-3 pt-2 pb-2 pr-3 gap-2">
              <p className="cursor-pointer">Template 1</p>
              <p className="cursor-pointer">Template 2</p>
            </div> */}
            <div className="bg-purple-100 cursor-pointer rounded my-2 self-center flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-2 py-1 opacity-85 self-center dark:text-black">New Project</button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-base">Create Project.</DialogTitle>
                      <DialogDescription className="opacity-70 text-sm">
                        Enter the project name and description.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Project Name" className="text-right">
                          Project name
                        </Label>
                        <Input
                          id="Project Name"
                          className="col-span-3 text-sm"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <textarea
                          id="description"
                          className="col-span-3 px-2 py-1 text-sm border border-black rounded-md"
                          value={description}
                          onChange={(e) => setdescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={createProject} className="pl-10 pr-10 "> 
                                {stateButtonLoaded === true ? <Loader2 size={12} className="animate-spin"/> : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
            <p className="flex opacity-40 items-center border-b bg-violet-100 rounded py-1 cursor-pointer justify-center gap-1">
              <span className="dark:text-black opacity-75">Generate with AI</span>
              <span><Star size={10} /></span>
            </p>
          </div>

          {/* Main part  */}
          <div className="min-h-screen px-4">

            <div className="flex justify-between items-center border-b py-1">
              <p className="text-sm">Generate Your Mindmap</p>
              <div>
                <Select onValueChange={handleThemeFormat}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue className='placeholder:text-xs' placeholder={"Theme"}/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup >
                      <SelectItem value="dark" className='text-xs cursor-pointer'>Dark</SelectItem>
                      <SelectItem value="light" className='text-xs cursor-pointer'>Light</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              {/* fetched data layout  */}
              <div className='flex justify-around pt-7 border-b opacity-70 text-sm'>
                  <p>Index</p>
                  <p>Project Name</p>
                  <p>Project Description</p>
                  <p>created At</p> 
              </div>

              {/* showing project data result  */}
              {projectdata.length != 0 ? (
                <div>
                  {projectdata.map((projectdatafeild : any,idx : number) => (
                    <ContextMenu key={idx}>
                      <ContextMenuTrigger>
                        <div className="flex justify-around pt-5 border-b cursor-pointer opacity-85 text-[0.8rem]"  onClick={() => moveToworkflow(projectdatafeild?._id)}>
                            <p>{idx}</p>
                            <p>{projectdatafeild?.projectName}</p>
                            <p>{makeShort(projectdatafeild?.description,15) ?? "-"}</p>
                            <p>{projectdatafeild?.created_At ?? "-"}</p>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        {/* for updating the project name  */}
                        <ContextMenuItem> 
                          <Dialog>
                            <DialogTrigger asChild>
                            <button className="opacity-85 self-center" onClick={(e) => e.stopPropagation()}>Change Project Name</button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="text-base">Update Project Name..</DialogTitle>
                                <DialogDescription className="opacity-70 text-sm">
                                  Enter the new project name to be updated.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="Project Name" className="text-right">
                                    New Project name
                                  </Label>
                                  <Input
                                    id="Project Name"
                                    className="col-span-3 text-sm"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={() => updateProjectName(projectdatafeild?._id,projectName)}>Update</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </ContextMenuItem>
                        {/* for deleting the Project */}
                        <ContextMenuItem onClick={() => deleteProject(projectdatafeild?._id)}>Delete Project</ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </div>
              ) :
              (
                <div className="opacity-50 flex flex-col item-center pt-20 text-sm">
                  <p className="text-center">No Project created yet.</p>
                  <div className="bg-purple-100 rounded self-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-purple-100 rounded self-center dark:bg-purple-200 dark:text-black">Create one..</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-base">Create Project.</DialogTitle>
                            <DialogDescription className="opacity-70 text-sm">
                              Enter the project name and description.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="Project Name" className="text-right">
                                Project name
                              </Label>
                              <Input
                                id="Project Name"
                                className="col-span-3 text-sm"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="description" className="text-right">
                                Description
                              </Label>
                              <textarea
                                id="description"
                                className="col-span-3 px-2 py-1 text-sm border border-black rounded-md"
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={createProject} className="pl-10 pr-10 "> 
                              {stateButtonLoaded === true ? <Loader2 size={12} className="animate-spin"/> : "Create"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  </div>
                </div>
              )}

            </div>
          </div>

      </div>
    </main>
  )
} 