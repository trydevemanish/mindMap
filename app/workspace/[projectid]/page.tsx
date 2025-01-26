"use client"

import { useParams } from 'next/navigation'
import React, { useEffect,useState,useCallback, useRef } from 'react'
import { DownloadCloud,Share2Icon } from 'lucide-react';

import {
  ReactFlow,
  addEdge,
  applyEdgeChanges, applyNodeChanges,Background 
} from '@xyflow/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
import '@xyflow/react/dist/style.css';
import { Node,Edge } from "@xyflow/react"
import ContextMenu from '@/components/ContextMenu';
import { Menu,Position } from '@/types/types';
import { getURL } from 'next/dist/shared/lib/utils';
import puppeteer from "puppeteer"
import { useToast } from "@/hooks/use-toast"

export default function page() { 
  const [nodeData,setNodeData] = useState([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeID,setNodeID] = useState({});
  const [totalChildNodeCount,setTotalChildNodeCount] = useState<number>()
  const [menu, setMenu] = useState<Menu>(null);
  const ref = useRef<HTMLDivElement>(null); 
  const [shareInput,setShareInput] = useState("");

  const [checkPostitionUpdated,setCheckPostitionUpdated] = useState(false)
  const [checkCreatedNewNode,setCheckCreatedNewNode] = useState<boolean>(false);
  const [checkBgColorChange,setCheckBgColorChange] = useState(false);
  const [checktextUpdated,setCheckTextUpdated] = useState(false);
  const [checkNodeDeleted,setCheckodeDeleted] = useState(false);
  const [checkLinkUpdated,setCheckLinkUpdated] = useState(false);
  const [stateButtonLoaded,setStateButtonLoaded] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null); 

  const [ parentNodePosition,setParentNodePosition] = useState<Position>({ x : 396.00 , y : 162.00 });
  const { projectid } = useParams()
  const { toast } = useToast()



  // on window load fetch all node of a project
  useEffect(() => {
    async function fetchallNodes(){
      try {

        const res = await fetch(`/api/getallNodes/${projectid}`)
        if(res.status != 200){
          console.log(res)
        }
        const data = await res.json()

        //checking if there is data (which is an array) in my data variable if not then i will creta a default one 
        if(data?.data?.length == 0){
          createDefaultNode()
        }

        setNodeData(data?.data) // set the node data here

      } catch (error) {
        console.log(error ?? "Error from Server side")
      }
    }
      fetchallNodes()
  },[checkCreatedNewNode,checkPostitionUpdated,checkBgColorChange,checktextUpdated,checkNodeDeleted,checkLinkUpdated])


  useEffect(() => {
    
    const initialNodes = nodeData.flatMap((nodefield : any) => [{
      id : `${nodefield?._id.toString()}`,
      position : {
        x : nodefield?.position?.x,
        y :  nodefield?.position?.y,
      },  
      data : {
        label : `${nodefield?.title}`
      },
      style: {
        backgroundColor: nodefield?.style?.backgroundColor
      }
    }])

    const initialEdges = nodeData.flatMap((nodefield : any) => {
      if(!nodefield?.parentNodeID) return []; //if no parent of a node then it mean it is root node
      return [{
        id : `e${nodefield?.parentNodeID}-${nodefield?._id}`,
        source : `${nodefield?.parentNodeID}`,
        target : `${nodefield?._id.toString()}`
      }]
    }) 

    setNodes(initialNodes)
    setEdges(initialEdges)

  },[nodeData,checkCreatedNewNode,checkPostitionUpdated,checkBgColorChange,checktextUpdated,checkNodeDeleted,checkLinkUpdated])

  // async function to create node
  async function createDefaultNode(){ 
    try {

      const res = await fetch(`/api/addnodes/${projectid}`,{
        method : "POST",
        headers : {
          "Content-Type":"application/json"
        },
        body : JSON.stringify({ title : "Default Node", position : { "x" : parentNodePosition.x , "y" : parentNodePosition.y } })
      })

      if(res.status != 201){
        console.log("Error While creatinig Node in DB")
      }

      const data = await res.json()

      setCheckCreatedNewNode(!checkCreatedNewNode)

    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  }


  // how i will creta a new node 
  // first i will select the node then i will press shift+N -> then the selected node id will be passed as a parent id and new node will be created
  // how the flow will look like 
  // select a node -> after selecting a node find its detail -> press shift+N -> after it pressed i will pass his id as parentnodeid and call the function

  async function createNewNode(parent_id : string | any) {
    try {

      // here i need to find the position of the node that is being created and set position of it 

      const nodePositon : Position = calculateChildNodePosition(parentNodePosition,totalChildNodeCount)

      if(!nodePositon){
        console.error(nodePositon ?? "Node position Error")
        return;
      }

      const res = await fetch(`/api/addnodes/${projectid}`,{
        method : "POST",
        headers : {
          "Content-Type":"application/json"
        },
        body : JSON.stringify({ title : "New Node", position : { "x" : nodePositon.x , "y" : nodePositon.y }, parentNodeID : parent_id })  
      })

      if(res.status != 201){
        console.log("Error While creatinig Node in DB")
      }

      const data = await res.json()

      setCheckCreatedNewNode(!checkCreatedNewNode)
      
      toast({
        title : data?.message,
        className:"w-[300px]"
      }) 

    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  }


  // program to delete the node when clicked once and delte button is pressed
  async function deleteNode(nodeid : any){
    try {

      const res = await fetch(`/api/deleteNode/${nodeid}`,{
        method : "DELETE"
      })
    
      if(res.status != 200){
        console.log(res)
      }
      const data = await res.json();
    
      setCheckodeDeleted(!checkNodeDeleted)

      toast({
        title : data?.message,
        className:"w-[300px]"
      }) 
      
    } catch (error) {
      console.log(error ?? "Server Side Error")
    }
  }  

  async function toFindSingleNodeDetail(id :any){
    try {

      const res = await fetch(`/api/fetchSingleNode/${id}`)
      if(res.status != 200){
        console.log(res)
      } 

      const data = await res.json()

      setNodeID(data?.data?._id) // setting id to find the node detail and putting this id as a parent id for creating a new node.
      // setChildNodeCount(data?.data?.childNodeID)

      const totaChilddata : any = data?.data?.childNodeID
      // console.log(totaChilddata.length)
      setTotalChildNodeCount(totaChilddata.length) //setting total child node count to calculate the position of the node.


      // calulating position of the parent node 
      const calculateParentNodePositon : Position = data?.data?.position

      setParentNodePosition(calculateParentNodePositon);
      

      
    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  }

  // delete All Nodes of a project
  async function deleteAllNodes(projectIdTobepassed:any) {
    try {

      const res = await fetch(`/api/deleteAllNodes/${projectIdTobepassed}`,{
        method : "DELETE"
      })

      if(res.status != 200){
        console.log(res)
      }

      const data = await res.json()

      toast({
        title : data?.message,
        className:"w-[300px]"
      }) 

      setCheckodeDeleted(!checkNodeDeleted)

      toast({
        title : data?.message,
        variant : 'destructive'
      })
      
      createDefaultNode()
      
    } catch (error) {
      console.log(error ?? "Internal Server Error")
    }
  }

  // function to select a node and find the detail of the node this method comes from the reactflow libraby
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    toFindSingleNodeDetail(node.id)
  } 

  // function which will listen to keyboard events
  const handleKeyPress = (e: KeyboardEvent) => {
    if(e.shiftKey && e.key == "N" && selectedNode){
      createNewNode(nodeID);
    }
    if(e.key === "Delete" && selectedNode){
      deleteNode(nodeID);
    }
  }


  // writng a progrmam to listen on keyboard events
 useEffect(() => {
  window.addEventListener('keydown', handleKeyPress);
  return () => {
     window.removeEventListener('keydown', handleKeyPress)
  }
 },[selectedNode])


const onNodeContextMenu = useCallback(
  (event :  React.MouseEvent, node: Node) => {
    // Prevent native context menu from showing
    event.preventDefault();

    // Calculate position of the context menu. We want to make sure it
    // doesn't get positioned off-screen.
    if(ref.current){
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 100 && event.clientY,
        left: event.clientX < pane.width - 100 && event.clientX,
        right: event.clientX >= pane.width - 100 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 100 && pane.height - event.clientY,
      });
    } else {
      console.log("errro in the ref field")
    }
  },
  [setMenu],
);

const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

// function to download the file 
async function downloadInPdfFormat(){
  try {

    const res = await fetch("/api/genereatePdf");

    if(!res.ok){
      console.log("Failed to generate PDF")
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.pdf';
    document.body.appendChild(link);  
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
}


const convertToMarkdown = (nodeData : any) => {

  if (!nodeData || nodeData.length === 0) return '';
  const rootNode = nodeData.find((node : any) => node?.parentNodeID === null)
  if(!rootNode){
    console.error("No Root Node")
  }

  let markdown = `# ${rootNode.title}\n\n`

  const buildMarkdownTree = (node: any, level: number) => {
    const childID  = node?.childNodeID || [];
    const childrenNode = nodeData.filter((n : any) => childID.includes(n._id))

    childrenNode.forEach((child : any) => {
      markdown += `${'  '.repeat(level)}- ${child?.title}\n`
      buildMarkdownTree(child, level + 1);
    })
  }
  buildMarkdownTree(rootNode, 1);
  return markdown;
}



const handleDownloadFormat = (format : 'pdf' | 'markdown') => {
  if(format === 'pdf'){
    downloadInPdfFormat()
  } else {
    const markdown = convertToMarkdown(nodeData);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.md';
    a.click();
    URL.revokeObjectURL(url);
  }
}

// functions to share the files 
async function constructShareUrl(){
  const constructedUrl = `${window.location.origin}${getURL()}`
  setShareInput(constructedUrl);
}

// function to handle node drag and adjust aw to position
const handleNodeDragStop = (event: React.MouseEvent, node: Node) => {
  updatedNodePosition(node?.id, node?.position?.x,node?.position?.y)
}



// function to update fields 
async function updatedNodePosition(nodeid : any, new_X :any , new_Y : any) {
  try {

     const res = await fetch(`/api/changeNodePosition/${nodeid}`,{
      method: "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ new_X, new_Y })
     })

     if(res.status != 200){
      console.log("failed res data",res)
     }

     const data = await res.json()

     setCheckPostitionUpdated(!checkPostitionUpdated)
    
  } catch (error) {
    console.log(error ?? "failed to update Position")
  }
}

// updating Background Color of Node
async function updateBgColorOfnode(nodeid : any, bgColorCode : string) {
  try {

    const res = await fetch(`/api/chBgcolor/${nodeid}`,{
      method : "PUT",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ bgColorCode })
    })

    if(res.status != 200){
      console.log(res)
    }

    const data = await res.json()

    setCheckBgColorChange(!checkBgColorChange)

  } catch (error) {
    console.log(error ?? "Internal server error")
  }
}

// async function to update text 
async function updatedText(nodeid :any, updatedText :string){
  try {

    setStateButtonLoaded(true)

    const res = await fetch(`/api/changetextofNode/${nodeid}`,{
      method  : 'PUT',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ updatedText })
    })

    if(res.status != 200){
      console.log(res)
    }

    const data = await res.json()

    toast({
      title : data?.message,
      className:"w-[300px]"
    })   

    setStateButtonLoaded(false)
    setCheckTextUpdated(!checktextUpdated)
    
  } catch (error) {
     console.log(error ?? "failed to update text")
  }
}

// async function to update Link 
async function UpdateAddLink(nodeid : any,link:string) {
  try {

    setStateButtonLoaded(true)

    const res = await fetch(`/api/addLinktoNode/${nodeid}`,{
      method  : 'PUT',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ link })
    })

    if(res.status != 200){
      console.log(res)
    }

    const data = await res.json()

    toast({
      title : data?.message,
      className:"w-[300px]"
    }) 

    setStateButtonLoaded(false)

    setCheckLinkUpdated(!checkLinkUpdated)
    
  } catch (error) {
    console.log(error ?? "failed to update link")
  }
}

// async function to open link
const onNodeDoubleClick = (event: React.MouseEvent,node: Node) => {
  handleFindNodeUrlLink(node?.id)
}

async function handleFindNodeUrlLink(nodeid:any) {
  try {

    const res = await fetch(`/api/findNodeLinkUrl/${nodeid}`)

    if(res.status != 200){
      console.log(res)

      const data = await res.json()

      toast({
          title : data?.message,
          className:"w-[300px]"
      }) 
    }

    const data = await res.json()

    toast({
        title : data?.message,
        className:"w-[300px]"
    })  

    window.open(`https://www.${data?.data}`,'_blank')


  } catch (error) {
    console.log(error ?? "Internal Error")
  }
}


// function to calculate position 
// it will return the positon of the newly node created

 const Horizontal_Spacing : number = 100;
 const Vertical_Spacing : number = 70;

  const calculateChildNodePosition = (parentPosition : Position, totalChildren : number | any) => {
    // if parent Node don't have any child then the posiont of its first child

    if(totalChildren === 1){
        return {
            x : parentPosition.x,
            y : parentPosition.y + Vertical_Spacing
        }
    } 

      const startX = parentPosition.x - ((totalChildren - 1) * Horizontal_Spacing) / 2;

      return {
        x: startX + ((totalChildNodeCount+1) * Horizontal_Spacing),
        y: parentPosition.y + Vertical_Spacing
      };

  }


  //---------------------------------------------------------------------------------------------------------
  // these three method are for the connectivity of the node , like moving ,connecting from one to another and moving edges

  const onNodesChange = useCallback(
    (changes : any) => setNodes((nds : any) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes : any) => setEdges((eds : any) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params : any) => setEdges((eds : any) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
        <div className='absolute right-8 z-10'>
          {/* this div part is for download part  */}
          <div className='pt-3 px-6 flex justify-end gap-8 z-50'>
              <Select onValueChange={handleDownloadFormat}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue className='placeholder:text-xs' placeholder={
                    <div className='flex gap-2'>
                      <DownloadCloud size={15} />
                      <span className='text-xs'>as</span>
                    </div>
                  }/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup >
                    <SelectItem value="pdf" className='text-xs cursor-pointer'>Pdf</SelectItem>
                    <SelectItem value="markdown" className='text-xs cursor-pointer'>Markdown</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* this part is for sharing the page  */}
              <div>
                  <Dialog>
                    <DialogTrigger asChild onClick={constructShareUrl}>
                      <button className='flex rounded border px-4 py-2 gap-1 items-center justify-center'>
                        <span className='text-xs cursor-pointer'>Share</span>
                        <Share2Icon size={13} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Share it...</DialogTitle>
                        <DialogDescription>
                          Give Permission to make changes.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-2 py-4">
                        <div>
                          <Input
                            id="name"
                            className="col-span-3 text-xs"
                            value={shareInput}
                            onChange={(e) => setShareInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={() =>  navigator.clipboard.writeText(shareInput)}
                        >Copy link</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
              </div>
          </div>
        </div>
       <ReactFlow
              ref={ref}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onNodeContextMenu={onNodeContextMenu}
              onNodeDragStop={handleNodeDragStop}
              onNodeDoubleClick={onNodeDoubleClick}
              fitView
            >
     <Background />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} 
          newNodeCreationFunction={createNewNode} 
          deletionOfNodeFunction={deleteNode} 
          updateBgColorOfnode={updateBgColorOfnode} 
          updatedText={updatedText} 
          UpdateAddLink={UpdateAddLink} 
          deleteAllNodes={deleteAllNodes}
          handleFindNodeUrlLink={handleFindNodeUrlLink}
          buttonStateChecker={stateButtonLoaded}
      />
      }
    </ReactFlow>

   </div>
  )
}
