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
import { useToast } from "@/hooks/use-toast"
import { NodeDataType } from '@/types/types';

export default function Page() { 
  const [nodeData,setNodeData] = useState<NodeDataType[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeID,setNodeID] = useState("");
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

  const [ parentNodePosition,setParentNodePosition] = useState<Position>({ x : 396.00 , y : 162.00 });
  const { projectid } = useParams()
  const { toast } = useToast()

  // async function to create node
  const createDefaultNode = useCallback(async() => {
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

      setCheckCreatedNewNode(!checkCreatedNewNode)

    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  },[checkCreatedNewNode,parentNodePosition.x,parentNodePosition.y,projectid]);

  // on window load fetch all node of a project
  useEffect(() => {
    async function fetchallNodes(){
      try {

        const res = await fetch(`/api/getallNodes/${projectid}`)

        if(res.status != 200){
          console.log(res)
        }

        const data = await res.json()

        if(data?.data?.length == 0){
          createDefaultNode()
        }
        
        setNodeData(data?.data)

      } catch (error) {
        console.log(error ?? "Error from Server side")
      }
    }
      fetchallNodes()
  },[checkCreatedNewNode,checkPostitionUpdated,checkBgColorChange,checktextUpdated,checkNodeDeleted,checkLinkUpdated,projectid])

  // setting value of inital node and edges
  useEffect(() => {
    
    const initialNodes = nodeData.flatMap((nodefield : NodeDataType) => [{
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

    const initialEdges = nodeData.flatMap((nodefield : NodeDataType) => {
      if(!nodefield?.parentNodeID) return []; 
      return [{
        id : `e${nodefield?.parentNodeID}-${nodefield?._id}`,
        source : `${nodefield?.parentNodeID}`,
        target : `${nodefield?._id.toString()}`
      }]
    }) 

    setNodes(initialNodes)
    setEdges(initialEdges)

  },[nodeData,checkCreatedNewNode,checkPostitionUpdated,checkBgColorChange,checktextUpdated,checkNodeDeleted,checkLinkUpdated])


  // function to calculate position it will return the positon of the newly node created

 const Horizontal_Spacing : number = 100;
 const Vertical_Spacing : number = 70;

  const calculateChildNodePosition = useCallback((parentPosition : Position, totalChildren : number) => {
    if(totalChildren === 0){
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

  },[totalChildNodeCount])


  const createNewNode = useCallback(async(parent_id : string) => {
    try {

      const nodePositon : Position = calculateChildNodePosition(parentNodePosition,totalChildNodeCount)

      if(!nodePositon.x || !nodePositon.y){
        console.error(nodePositon ?? "Node position Error")
        toast({
          title : 'Node not selected',
          className : 'w-[300px] text-sm '
        })
        return;
      }

      const res = await fetch(`/api/addnodes/${projectid}`,{
        method : "POST",
        headers : {
          "Content-Type":"application/json"
        },
        body : JSON.stringify({ title : "New Node", position : { "x" : nodePositon.x , "y" : nodePositon.y }, parentNodeID : parent_id })  
      })

      const data = await res.json()

      if(res.status != 201){
        console.log("Error While creatinig Node in DB")

        toast({
          title : data?.message,
          className:"w-[300px]"
        }) 
      }

      setCheckCreatedNewNode(!checkCreatedNewNode)
      
      toast({
        title : data?.message,
        className:"w-[300px]"
      }) 

    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  },[checkCreatedNewNode,parentNodePosition,projectid,toast,totalChildNodeCount,calculateChildNodePosition])

  // program to delete the node when clicked once and delte button is pressed 

  const deleteNode = useCallback(async(nodeid : string) => {
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
  },[checkNodeDeleted,toast])

  async function toFindSingleNodeDetail(id :string){
    try {

      if(!id){
        toast({
          title : "id not passed",
          className:"w-[300px]"
        }) 
      } else {
        toast({
          title : "fetched single Node detail",
          className:"w-[300px]"
        }) 
      }

      const res = await fetch(`/api/fetchSingleNode/${id}`)
      if(res.status != 200){
        console.log(res)
      } 

      const data = await res.json()

      setNodeID(data?.data?._id) // setting node id detail

      const totaChilddataLength : number = data?.data?.childNodeID.length

      setTotalChildNodeCount(totaChilddataLength) 

      const calculateParentNodePositon : Position = data?.data?.position

      setParentNodePosition(calculateParentNodePositon);
      
    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  }

  // delete All Nodes of a project
  async function deleteAllNodes(projectIdTobepassed:string) {
    try {

      const res = await fetch(`/api/deleteAllNodes/${projectIdTobepassed}`,{
        method : "DELETE"
      })

      if(res.status != 200){
        console.log(res)
      }

      const data = await res.json() 

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

  
  // writng a progrmam to listen on keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if(e.shiftKey && e.key == "N" && selectedNode){
        createNewNode(nodeID);
      }
      if(e.key === "Delete" && selectedNode){
        deleteNode(nodeID);
      }
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }

  },[selectedNode,deleteNode,createNewNode,nodeID])


const onNodeContextMenu = useCallback(
  (event :  React.MouseEvent, node: Node) => {
    event.preventDefault();

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
  

const convertToMarkdown = (nodeData : NodeDataType[]) => {

  if (!nodeData || nodeData.length === 0) return '';
  const rootNode = nodeData.find((node : NodeDataType) => node?.parentNodeID === null)
  if(!rootNode){
    console.error("No Root Node")
  }

  let markdown = `# ${rootNode.title}\n\n`

  const buildMarkdownTree = (node: NodeDataType, level: number) => {
    const childID  = node?.childNodeID || [];
    const childrenNode = nodeData.filter((n : NodeDataType) => childID.includes(n._id))

    childrenNode.forEach((child : NodeDataType) => {
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

const handleNodeDragStop = (event: React.MouseEvent, node: Node) => {
  updatedNodePosition(node?.id, node?.position?.x,node?.position?.y)
}



// function to update fields 
async function updatedNodePosition(nodeid : string, new_X :number , new_Y : number) {
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

     setCheckPostitionUpdated(!checkPostitionUpdated)
    
  } catch (error) {
    console.log(error ?? "failed to update Position")
  }
}

// updating Background Color of Node
async function updateBgColorOfnode(nodeid : string, bgColorCode : string) {
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

    setCheckBgColorChange(!checkBgColorChange)

  } catch (error) {
    console.log(error ?? "Internal server error")
  }
}

// async function to update text 
async function updatedText(nodeid :string, updatedText :string){
  try {

    setStateButtonLoaded(true)

    const res = await fetch(`/api/changetextofNode/${nodeid}`,{
      method  : 'PUT',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ updatedText })
    })

    const data = await res.json()

    if(res.status != 200){
      toast({
        title : data?.message,
        className:"w-[300px]"
      })
    }


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
async function UpdateAddLink(nodeid : string,link:string) {
  try {

    setStateButtonLoaded(true)

    const res = await fetch(`/api/addLinktoNode/${nodeid}`,{
      method  : 'PUT',
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({ link })
    })

    const data = await res.json()

    if(res.status != 200){
      console.log(res)
      toast({
        title : data?.message,
        className:"w-[300px]"
      }) 
    }


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


async function handleFindNodeUrlLink(nodeid:string) {
  try {

    const res = await fetch(`/api/findNodeLinkUrl/${nodeid}`)

    const data = await res.json()
    if(res.status != 200){
      toast({
          title : data?.message,
          className:"w-[300px]"
      }) 
    }

    toast({
        title : data?.message,
        className:"w-[300px]"
    })  

    window.open(`https://www.${data?.data}`,'_blank')

  } catch (error) {
    console.log(error ?? "Internal Error")
  }
}


  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
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
