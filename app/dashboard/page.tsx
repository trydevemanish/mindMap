"use client"
import { Star } from "lucide-react"
import React, { useRef } from "react"
import { useEffect, useState } from "react"
import { Button } from '@/components/ui/button'

import { Loader2,Plus, X } from "lucide-react"
import { ProjectType } from "@/types/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import useDataStore from "@/lib/useStore"

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


const diagramStyleToChoose = [
  {
    stylename : 'mindmap'
  },
  {
    stylename : 'sequenceDiagram'
  },
  {
    stylename : 'erDiagram'
  },
  {
    stylename : 'timeline'
  },
  {
    stylename : 'kanban'
  },
  {
    stylename : 'graph TD'
  },
]

export default function Page() {
  const [projectdata, setProjectData] = useState<ProjectType[] | null>([])
  const [projectName,setProjectName] = useState("")
  const [description,setdescription] = useState("")
  const [selectedStyle,setSelectedStyle] = useState(0)
  const [selectedStyleName,setSelectedStyleName] = useState("mindmap")

  const [newProjectCreated,setNewProjectCreated] = useState(false)
  const [projectDeleted,setProjectDeletd] = useState(false);
  const [updatingProjectName,setUpdatingProjectName] = useState(false)
  const [darkTheme,setDarkTheme] = useState("")
  const [stateButtonLoaded,setStateButtonLoaded] = useState(false)
  const [loading,setLoading] = useState(false)

  const [openSidebar,setOpenSidebar] = useState(false)

    const { toast } = useToast()
    const router = useRouter()
    const hasFetchedData = useRef(false)

    // create a new Project 

    async function createProject(){
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
          toast({
            title : errorText,
            className:'w-[300px] text-sm'
          })
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
      } finally {
        setStateButtonLoaded(false)
      }
    }


    async function deleteProject(projectid : string) {
      try {

       toast({
         title : `project deleting ...`,
         className:"w-[300px] text-sm font-light"
       })

       const res = await fetch(`/api/deleteProject/${projectid}`,{
         method : "DELETE"
       })

       if(!res.ok){
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
   }   

    // update Project Name 

    async function updateProjectName(projectid:string,newProjectName : string) {
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

        if(!res.ok){
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
        
      } catch (error) {
        console.log(error ?? "Internal Server Error")
      } finally {
        setUpdatingProjectName(false)
      }
    }

    // fetch all the project details
    useEffect(() => {
        async function fetchProjectDetail(){
          try {

            if(hasFetchedData.current) return
            hasFetchedData.current = true

            setLoading(true)
    
            const res = await fetch("/api/fetchProject")
    
            if(!res.ok){
              const errormsg = await res.json();
              toast({
                title : errormsg,
                className:'w-[300px] text-sm'
              })
              return;
            }
    
            const data = await res.json()

            setProjectData(data?.data)
            
          } catch (error) {
            console.log(error ?? "Server Internal issue")
          } finally {
            setLoading(false)
          }
        }
        // fetchProjectDetail()
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

    const handleGenerateMarkdown = async() => {
      try {

        setStateButtonLoaded(true)

        const markdownGenerated = await fetch(`/api/generatemarkdown/${selectedStyleName}`,{
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({ description : description })
        })

        if(!markdownGenerated){
          console.error(await markdownGenerated.text())
          return ;
        }

        const data = await markdownGenerated.json()

        if(!data){
          console.error('No data received')
          return;
        }

        const Passingdata = {
          description : description,
          markdowndata : data?.data
        }

        // Set outside React
        useDataStore.getState().setData(Passingdata);
        
        router.push('/newpage')

      } catch (error) {
        console.error(`Issue Occured: ${error}`)
      } finally {
        setStateButtonLoaded(false)
      }
    }

  return(
    <main className={`${darkTheme == 'dark' ? 'dark' : 'light'}`}>
      <div className="md:grid md:grid-cols-[16vw_1fr] min-h-screen overflow-hidden dark:border-white dark:text-white dark:bg-black">

          {/* sidebar part  */}
          <div className="min-h-screen border-r dark:border-white border-black text-[13px] px-4 py-3 xs:hidden xs:invisible md:block md:visible">
            <div className="font-sans cursor-pointer rounded hover:bg-purple-200 mb-1 py-1 px-2 self-center flex justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="opacity-85 self-center dark:text-black">New Project</button>
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

            <div className=" font-sans cursor-pointer bg-purple-100 rounded hover:bg-purple-200 px-2 self-center flex justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="self-centerc  dark:text-black">
                      <p className="flex items-center font-sans rounded py-1 cursor-pointer justify-start gap-1">
                        <span className="dark:text-black">Generate with AI</span>
                        <span><Star size={10} className="text-white" /></span>
                      </p>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                      <DialogTitle className="text-base">Generate diagram with Ai.</DialogTitle>
                      <DialogDescription className="opacity-70 text-sm">
                        What do you want to create..
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="text-right">
                          What style you want your diagram to be.
                        </Label>
                        <div className="flex flex-wrap gap-5 items-center">
                          {diagramStyleToChoose.map((data,idx) => (
                            <p 
                              key={idx} 
                              onClick={() => {
                                setSelectedStyle(idx)
                                setSelectedStyleName(data?.stylename)
                              }}
                              className={`
                                px-4 py-1 rounded-full text-sm cursor-pointer
                                ${selectedStyle === idx ? 'bg-violet-500 text-white font-semibold ': 'bg-violet-200'}
                              `}
                            >{data?.stylename}</p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="description" className="text-right">
                          Describe your diagram here
                        </Label>
                        <textarea
                          id="description"
                          className="col-span-3 px-2 py-1 text-sm border border-black rounded-md w-full"
                          value={description}
                          rows={7}
                          onChange={(e) => setdescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <div className="flex flex-col gap-3 items-center justify-center w-full ">

                      <Button type="submit" onClick={handleGenerateMarkdown} className="pl-20 pr-20 text-sm "> 
                                {stateButtonLoaded === true ? <Loader2 size={12} className="animate-spin"/> : "Create"}
                      </Button>
                      <p className="text-black text-xs">powered by google gemini.</p>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          </div>  

          {/* open sidebar  */}

          {openSidebar ? (
            <div className="min-h-screen border-r dark:border-white border-black text-sm px-4 py-3 md:hidden md:invisible xs:visible xs:block w-72 animate-out">
              <div className="flex justify-end">
                <X className="size-6" onClick={() => setOpenSidebar(!openSidebar)}/>
              </div>
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
          ) : (
            <>
            </>
          )}

          {/* Main part  */}
          <div className="min-h-screen px-4">

            <div className="flex justify-between items-center border-b py-1">
              <p className="text-sm flex gap-1 items-center">
                <span><Plus className="size-5 cursor-pointer xs:visible xs:block md:hidden md:invisible" onClick={() => setOpenSidebar(!openSidebar)} /></span>
                <span className="xs:text-[14px] md:text-xs">Mindmap you created.</span>
              </p>
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
              <div className='grid grid-cols-4 pt-3 gap-[1px] border-b xs:text-[13px]  md:text-xs'>
                  <p className="col-start-1 col-end-2 text-center bg-purple-300 py-1 ">Index</p>
                  <p className="col-start-2 col-end-3 text-center bg-purple-300 py-1 ">Project Name</p>
                  <p className="col-start-3 col-end-4 text-center bg-purple-300 py-1 ">Project desc..</p>
                  <p className="col-start-4 col-end-5 text-center bg-purple-300 py-1 ">Created at</p> 
              </div>

              {
                loading?
                <div className="flex flex-col items-center min-h-[calc(96vh-4rem)] justify-center">
                  <p className='text-sm opacity-70 animate-pulse'>Fetching your previous mindmap data.</p>
                </div> :
                <div>
                  {
                    Array.isArray(projectdata) && projectdata.length > 0 ?
                    <div>
                      {projectdata.map((projectdatafeild : ProjectType,idx : number) => (
                        <ContextMenu key={idx}>
                          <ContextMenuTrigger>
                            <div key={idx} className="grid grid-cols-4 py-3 border-b cursor-pointer opacity-85 text-[0.8rem]"  onClick={() => moveToworkflow(projectdatafeild?._id)}>
                                <p className="col-start-1 col-end-2 text-center">{idx}</p>
                                <p className="col-start-2 col-end-3 text-center">{projectdatafeild?.projectName}</p>
                                <p className="col-start-3 col-end-4 text-center text-wrap">{makeShort(projectdatafeild?.description,50) ?? "-"}</p>
                                <p className="col-start-4 col-end-5 text-center">{projectdatafeild?.created_At ?? "-"}</p>
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
                    :
                    <div className="opacity-80 flex flex-col item-center mt-60 text-sm">
                      <p className="text-center py-3">No Project created yet! Create a new one ~ try generating with Ai.</p>
                      <div className="bg-purple-100 rounded self-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className='text-xs bg-purple-200 hover:bg-purple-300 px-7 dark:bg-purple-200 dark:text-black rounded-md py-[7px]'>Create one</button>
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
                  }
                </div>
              }
            </div>
          </div>

      </div>
    </main>
  )
} 