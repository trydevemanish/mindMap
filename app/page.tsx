"use client"
import { Star } from "lucide-react"
import React from "react"
import { useEffect, useState,useCallback } from "react"
import { Button } from "../components/ui/button"
import { Loader2 } from "lucide-react"
import { ProjectType } from "@/types/types"
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
  const [projectdata, setProjectData] = useState<ProjectType[] | null>([])
  const [projectName,setProjectName] = useState("")
  const [description,setdescription] = useState("")

  const [newProjectCreated,setNewProjectCreated] = useState(false)
  const [projectDeleted,setProjectDeletd] = useState(false);
  const [updatingProjectName,setUpdatingProjectName] = useState(false)
  const [darkTheme,setDarkTheme] = useState("")
  const [stateButtonLoaded,setStateButtonLoaded] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    
    // create a new Project 
    const createProject = useCallback(async() => {
      try {

        setStateButtonLoaded(true)

        const res = await fetch("/api/createProject",{
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ projectName : projectName, description : description })
        })

        if(!res.ok){
          const errorText = await res.text();
          console.error(`Failed to create: ${errorText}`);
          toast({
            title: "Failed to create project",
            description: errorText,
            variant: "destructive",
            className: "w-[300px] text-sm font-light",
          });
          return;
        }

        const data = await res.json()

        setNewProjectCreated(!newProjectCreated)

        toast({
          title : data?.message,
          className:"w-[300px] text-sm font-light"
        }) 

      } catch (error) {
        console.log(error ?? "Internal Server Issue")
        toast({
          title: "Internal Server Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
          className: "w-[300px] text-sm font-light",
        });
      } finally {
        setStateButtonLoaded(false)
      }
    },[newProjectCreated,toast,projectName,description])


    // // delete a Project
    const deleteProject = useCallback(async(projectid : string) => {
      try {

        toast({
          title : `project deleting ...`,
          className:"w-[300px] text-sm font-light"
        })

        const res = await fetch(`/api/deleteProject/${projectid}`,{
          method : "DELETE"
        })

        if(res.status != 200){
          const errorText = await res.text();
          toast({
            title : errorText,
            className:'w-[300px] text-sm'
          })
          return;
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
    },[projectDeleted,toast])


    // update Project Name 
    const updateProjectName = useCallback(async(projectid:string,newProjectName : string) => {
      try {

        setUpdatingProjectName(true)

        toast({
          title : `updating Project Name...`,
          className:"w-[300px] text-sm font-light"
        })

        const res = await fetch(`/api/changeProjectName/${projectid}`,{
          method : "PUT",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({ newProjectName : newProjectName })
        })

        if(res.status != 200){
          const errorText = await res.text();
          toast({
            title : errorText,
            className:'w-[300px] text-sm'
          })
          return;
        }

        const data = await res.json()

        toast({
          title : data?.message,
          className:"w-[300px] text-sm font-light"
        })

        setUpdatingProjectName(false)
        
      } catch (error) {
        console.log(error ?? "Internal Server Error")
      } 
    },[toast])

    // fetch all the project details
    useEffect(() => {
        async function fetchProjectDetail(){
          try {
    
            const res = await fetch("/api/fetchProject")
    
            if(res.status != 200){
              const errorText = await res.text();
              toast({
                title : errorText,
                className:'w-[300px] text-sm'
              })
              return;
            }
    
            const data = await res.json()

            setProjectData(data?.data)
            
          } catch (error) {
            console.log(error ?? "Server Internal issue")
          }
        }
        fetchProjectDetail()
    },[newProjectCreated,projectDeleted,updatingProjectName,toast])


    function makeShort(text : string,minlen : number){
      if(minlen >= text.length){
        return text
      }
  
      return text.slice(0,minlen)+"..."
    }

    function moveToworkflow(projectID : string){
      toast({
        title : "Moving to workspace...",
        className:"w-[300px] text-sm font-light"
      })
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
                  {projectdata.map((projectdatafeild : ProjectType,idx : number) => (
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
                            <DialogContent className="sm:max-w-[425px]" onKeyDown={(e) => e.stopPropagation()}>
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
                                <Button type="submit" onClick={() => updateProjectName(projectdatafeild?._id,projectName)} className="pl-10 pr-10 ">
                                  {updatingProjectName === true ? <Loader2 size={12} className="animate-spin"/> : "Update"}
                                </Button>
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