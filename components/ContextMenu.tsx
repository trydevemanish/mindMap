import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
 
export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  ...props
} : { id : any , top : any, left : any, right : any, bottom : any, onClick?: () => void;}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node : any = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
 
    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);
 
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);



  async function createNewNode(parent_id : any) {
    try {

      const res = await fetch(`/api/addnodes/${id}`,{
        method : "POST",
        headers : {
          "Content-Type":"application/json"
        },
        body : JSON.stringify({ title : "New Node", position : { "x" : 300 , "y" : 300 },parentNodeID : parent_id }) // here i will need to pass the parent node id 
      })

      if(res.status != 201){
        console.log("Error While creatinig Node in DB")
      }

      const data = await res.json()

      console.log(data?.message)

    } catch (error) {
      console.log(error ?? "Internal Server error")
    }
  }


 
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
      <button onClick={createNewNode}>New Node</button>
      <button>Edit text</button>
      <button>Bg color</button>
      <button>text color</button>
      <button>Mark as Done</button>
    </div>
  );
}