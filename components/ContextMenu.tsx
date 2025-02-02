"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { BgColorList } from "@/components/Bgcolor"
import { Input } from '@/components/ui/input';
import { getURL } from 'next/dist/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { BgColorInterface } from '@/types/types';

 
export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  buttonStateChecker,
  newNodeCreationFunction,
  deletionOfNodeFunction,
  updateBgColorOfnode,
  updatedText,
  UpdateAddLink,
  deleteAllNodes,
  handleFindNodeUrlLink,
  ...props
} : { 
    id : string ,
    top : number,
    left : number,
    right : number, 
    bottom : number, 
    onClick?: () => void, 
    buttonStateChecker : boolean,
    newNodeCreationFunction? : (id : string) => void, 
    deletionOfNodeFunction? : (id :string) => void, 
    updateBgColorOfnode? : (id : string, bgColorCode? : string) => void, 
    updatedText?: (id : string, inputText:string) => void,
    UpdateAddLink?: (id : string, link : string) => void, 
    deleteAllNodes?: (id : string) => void, 
    handleFindNodeUrlLink?: (id : string) => void,
  }) {

    const [inputText,setInputText] = useState("Enter the text .........")
    const [addLink,setAddLink] = useState("Ex like- google.com")

    const handleNewNodeCreation = () => {
        newNodeCreationFunction(id);
    }

    const handleDeletionOfNode = () => {
        deletionOfNodeFunction(id);
    }

    const handleChangeOfBackgroundColor = (bgColorCode : string) => {
      updateBgColorOfnode(id,bgColorCode)
    }

    const handleUpdateTextofNode = () => {
        updatedText(id,inputText)
    }

    const handleAddLInk = () => {
      UpdateAddLink(id,addLink)
    }

    const handleDeleteAllNodes = () => {
      const projectId = getURL().split("/")
      deleteAllNodes(projectId[2])
    }

    const handleOpenLink = () => {
      handleFindNodeUrlLink(id)
    }

  
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu px-2 rounded py-3 w-40 flex-col justify-center items-center"
      {...props}
    >
      <div onClick={handleNewNodeCreation} className='cursor-pointer pl-3 pr-3 pt-1 pb-2 hover:bg-zinc-50 hover:rounded'>New Node</div>
      <div onClick={handleDeletionOfNode} className='cursor-pointer pl-3 pr-3 pb-2 hover:bg-zinc-50 hover:rounded'>Delete</div>
      <div onClick={handleDeleteAllNodes} className='cursor-pointer pl-3 pr-3 pb-2 hover:bg-zinc-50 hover:rounded'>Delete All Nodes</div>
      <div onClick={handleOpenLink} className='cursor-pointer pl-3 pr-3 pb-2 hover:bg-zinc-50 hover:rounded'>Open Link</div>
      <div className='pl-3 pr-3 pb-2 hover:bg-zinc-50 hover:rounded'>
            <Dialog>
              <DialogTrigger asChild>
                 <p className="cursor-pointer">Add Link</p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle >Add Link</DialogTitle>
                  <DialogDescription>
                    Enter the Link....
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div>
                    <Input
                      id="Link"
                      value={addLink}
                      className="text-sm"
                      onChange={(e) => setAddLink(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddLInk} className="pl-16 pr-16"> 
                              {buttonStateChecker ? <Loader2 size={12} className="animate-spin"/> : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      </div>
      <div className='pl-3 pr-3 pb-2 hover:bg-zinc-50 hover:rounded'>
      <Dialog>
              <DialogTrigger asChild  >
                 <p className="cursor-pointer">Edit Text</p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle onClick={onClick}/>
                  <DialogDescription>
                    Enter the text....
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <div>
                    <Input
                      id="name"
                      value={inputText}
                      className="text-sm"
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleUpdateTextofNode} className="pl-16 pr-16 "> 
                              {buttonStateChecker === true ? <Loader2 size={12} className="animate-spin"/> : "Save changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      </div>
      <div className='pl-3 pb-1 hover:bg-zinc-50 hover:rounded'> 
        <Dialog>
          <DialogTrigger asChild>
            <p className='cursor-pointer'>Change Bg</p>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle />
              <DialogDescription>
                Choose Background Color of Node.
              </DialogDescription>
            </DialogHeader>
              {Array.isArray(BgColorList) && BgColorList.map((bgcolorfields : BgColorInterface) => (
                <p 
                    key={bgcolorfields?.bgColor_id} 
                    className='cursor-pointer text-sm border-b px-2 opacity-70'
                    style={{ borderColor : bgcolorfields?.bgColorCode }} 
                    onClick={() => handleChangeOfBackgroundColor(bgcolorfields?.bgColorCode)}
                >
                  {bgcolorfields?.bgColorName}
                </p>
              ))}
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}