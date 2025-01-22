import React, { useCallback, useState } from 'react';
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
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
 
export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  onClick,
  newNodeCreationFunction,
  deletionOfNodeFunction,
  updateBgColorOfnode,
  updatedText,
  UpdateAddLink,
  ...props
} : { id : any , top : any, left : any, right : any, bottom : any, onClick?: () => void, newNodeCreationFunction? : (id : any) => any, deletionOfNodeFunction? : (id :any) => void, updateBgColorOfnode? : (id : any, bgColorCode : string) => void, updatedText?: (id : any, inputText:string) => void,UpdateAddLink?: (id : any, link) => void }) {

    const [inputText,setInputText] = useState("Enter the text .........")
    const [addLink,setAddLink] = useState("")

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

  
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu flex-col justify-center items-center"
      {...props}
    >
      <div onClick={handleNewNodeCreation} className='pl-3 pr-3 py-1'>New Node</div>
      <div onClick={handleDeletionOfNode} className='pl-3 pr-3 py-1'>Delete</div>
      <div className='pl-3 pr-3 py-1'>text color</div>
      <div className='pl-3 pr-3 py-1'>
      <Dialog >
              <DialogTrigger asChild>
                 <p className="cursor-pointer">Add Link</p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle />
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
                  <Button type="submit" onClick={handleAddLInk}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      </div>
      <div className='pl-3 pr-3 py-1'>
      <Dialog >
              <DialogTrigger asChild>
                 <p className="cursor-pointer">Edit Text</p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle />
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
                  <Button type="submit" onClick={handleUpdateTextofNode}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
      </div>
      <div className=' text-sm pl-1'> 
        <Dialog>
          <DialogTrigger asChild>
            <button>Change Bg</button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle />
              <DialogDescription>
                Choose Background Color of Node.
              </DialogDescription>
            </DialogHeader>
              {Array.isArray(BgColorList) && BgColorList.map((bgcolorfields : any, idx :any) => (
                <p 
                    key={bgcolorfields?.bgColor_id} 
                    className='cursor-pointer' 
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